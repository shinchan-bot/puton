import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import logger from "../utils/logger";
import { isValidPhoneNumber } from "../utils/helper/common-function";
import { sendOtpPost } from "../utils/otpService";
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


class UserController {
    router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post("/login", this.login);
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

            // Check if an OTP already exists for this phone number
            const existingOtp = await prisma.otp.findFirst({
                where: {
                    phone: phone_number,
                    expiresAt: {
                        gte: new Date() // Check if it hasn't expired yet
                    }
                }
            });

            if (existingOtp) {
                // If the OTP is still valid, resend it
                const resendOtpStatus = await sendOtpPost(parseInt(existingOtp.otp), phone_number);
                return res.status(200).send({ success: resendOtpStatus.success, message: 'Resending existing OTP.' });
            } else {
                // If no valid OTP, generate a new one
                let otp = Math.floor(100000 + Math.random() * 900000);
                let expireAt = new Date();
                expireAt.setMinutes(expireAt.getMinutes() + 5); // Set expiry for 5 minutes

                const user = await prisma.user.create({
                    data: {
                        phone: phone_number
                    },
                });

                if (user) {
                    const { id, userType } = user;
                    const validOtp = otp.toString();

                    // Save the new OTP
                    const saveOtp = await prisma.otp.create({
                        data: {
                            otp: validOtp,
                            phone: phone_number,
                            userId: id,
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
    }
}

export default new UserController();