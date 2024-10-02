import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import logger from "../utils/logger";
import { isValidPhoneNumber } from "../utils/helper/common-function";
import { sendOtpPost } from "../utils/otpService";
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


class LoginController {
    router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post("/login", this.login);
        this.router.post("/confirm-otp", this.verifyOtp);
    }

    private login = async (req: Request, res: Response) => {
        try {
            const { phone_number, source, user_type }: {
                phone_number: string,
                source: string,
                user: string,
                user_type: string
            } = req.body;

            if (!phone_number) {
                return res.status(404).send("Phone number not found");
            }

            const validPhoneNumber: boolean = isValidPhoneNumber(phone_number);

            if (!validPhoneNumber) {
                return res.status(204).send("Phone number is not valid");
            }

            // If user_type is test or PUTON_USER, bypass OTP service
            if (user_type === (process.env.PUTON_USER || "testing")) {
                const staticOtp: number | any = process.env.PUTON_TEST_OTP || 2309;
                const data = await sendOtpPost(staticOtp, phone_number, user_type);

                return res.status(200).send({ success: data.success, message: data.message });
            }

            // Check if user already exists in the user table
            const existingUser = await prisma.user.findUnique({
                where: { phone: phone_number }
            });

            if (existingUser) {
                // User exists, now check if OTP exists and is still valid
                const existingOtp = await prisma.otp.findFirst({
                    where: {
                        phone: phone_number,
                        userId: existingUser.id,
                        expiresAt: {
                            gte: new Date() // OTP is not expired
                        }
                    }
                });

                if (existingOtp) {
                    // If OTP exists and is still valid, resend it
                    const resendOtpStatus = await sendOtpPost(parseInt(existingOtp.otp), phone_number);
                    return res.status(200).send({ success: resendOtpStatus.success, message: 'Resending existing OTP.' });
                } else {
                    // OTP is expired or not exist, create new one
                    const otp = Math.floor(100000 + Math.random() * 900000);
                    const expireAt = new Date();
                    expireAt.setMinutes(expireAt.getMinutes() + 5); // Set expiry for 5 minutes

                    // Update the OTP in the OTP table
                    await prisma.otp.upsert({
                        where: { phone: phone_number },
                        update: {
                            otp: otp.toString(),
                            expiresAt: expireAt
                        },
                        create: {
                            otp: otp.toString(),
                            phone: phone_number,
                            userId: existingUser.id,
                            expiresAt: expireAt
                        }
                    });

                    // Send the new OTP
                    const otpStatus = await sendOtpPost(otp, phone_number);
                    return res.status(200).send({ success: otpStatus.success, message: otpStatus.message });
                }
            } else {
                // If user doesn't exist, create a new user
                const user = await prisma.user.create({
                    data: {
                        phone: phone_number
                    }
                });

                if (user) {
                    // Generate a new OTP
                    const otp = Math.floor(100000 + Math.random() * 900000);
                    const expireAt = new Date();
                    expireAt.setMinutes(expireAt.getMinutes() + 5); // Set expiry for 5 minutes

                    // Save the new OTP
                    const saveOtp = await prisma.otp.create({
                        data: {
                            otp: otp.toString(),
                            phone: phone_number,
                            userId: user.id,
                            expiresAt: expireAt
                        }
                    });

                    if (saveOtp) {
                        const otpStatus = await sendOtpPost(otp, phone_number);
                        return res.status(200).send({ success: otpStatus.success, message: otpStatus.message });
                    } else {
                        return res.status(500).send({ success: false, message: "Failed to save OTP." });
                    }
                } else {
                    return res.status(500).send({ success: false, message: "Failed to create user." });
                }
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server Error");
        }
    };

    private verifyOtp = async (req: Request, res: Response) => {
        try {
            const { phone_number, otp, user_type }: {
                phone_number: string,
                otp: string,
                user_type: string
            } = req.body;

            if (user_type === (process.env.PUTON_USER || "testing")) {
                if (otp === (process.env.PUTON_TEST_OTP || "230924")) {
                    return res.status(200).send({ success: true, message: "OTP verified successfully." });
                } else {
                    return res.status(200).send({ success: true, message: "Invalid OTP. Please try again." });
                }
            }
            // Check if phone number and OTP are provided
            if (!phone_number || !otp) {
                return res.status(400).send({ success: false, message: "Phone number and OTP are required." });
            }

            // Check if the OTP exists for the given phone number and userId
            const existingOtp = await prisma.otp.findFirst({
                where: {
                    phone: phone_number,
                    otp: otp
                }
            });

            if (!existingOtp) {
                return res.status(404).send({ success: false, message: "OTP not found. Please request a new one." });
            }

            // Check if the OTP has expired
            const currentTime = new Date();
            if (existingOtp.expiresAt < currentTime) {
                return res.status(400).send({ success: false, message: "OTP has expired. Please request a new one." });
            }

            // Check if the provided OTP matches the one in the database
            if (existingOtp.otp !== otp) {
                return res.status(400).send({ success: false, message: "Invalid OTP. Please try again." });
            }

            return res.status(200).send({ success: true, message: "OTP verified successfully." });

        } catch (error) {
            logger.error(error);
            return res.status(500).send({ success: false, message: "Internal Server Error" });
        }
    };

}

export default new LoginController();