import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import logger from "../utils/logger";
import * as jwt from "jsonwebtoken";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AvatarController {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get("/avatar", this.avatar);
        this.router.post("/avatar", this.avatarCreate);
    }

    private avatar = async(req: Request, res: Response) => {
        try {
            const {userId, source, user_type} : {
                userId: number,
                source: string,
                user_type: string,
            } = req.body;
            
            const accessToken = req.headers.authorization;

            if(!accessToken) {
                return res.status(503).send("Bad request.");
            }
            const jwtDecode = jwt.verify(accessToken, process.env.PRIVATE_ACCESS_KEY as string);

            if(undefined === jwtDecode) {
                return res.status(503).send("Invalid Token.");
            }
            //TODO: Add token expiry check
            const avatar = await prisma.userAvatar.findFirst({
                where: {
                    userId: userId
                }
            })

            if(!avatar) {
                return res.status(404).send("Avatar does not exist.");
            }
            return res.status(200).json(avatar);
            
        } catch(err) {
            logger.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }

    private avatarCreate = async(req: Request, res: Response) => {
        try {
            //TODO: Add logic to handle userImage and avatarImage to generate s3 string.
            const {
                userId,
                source,
                user_type,
                userImage,
                avatarImage,
                height,
                weight,
                waist,
                chest,
                cupSize,
                skinTone
            } : {
                userId: number,
                source: string,
                user_type: string,
                userImage: string,
                avatarImage: string,
                height: number,
                weight: number,
                waist: number,
                chest: number,
                cupSize: string,
                skinTone: string
            } = req.body;

            const accessToken = req.headers.authorization;

            if(!accessToken) {
                return res.status(503).send("Bad request.");
            }
            const jwtDecode = jwt.verify(accessToken, process.env.PRIVATE_ACCESS_KEY as string);

            if(undefined === jwtDecode) {
                return res.status(503).send("Invalid Token");
            }
            //TODO: Add token expiry check
            const avatar = await prisma.userAvatar.upsert({
                where: {
                    userId: userId,
                },
                update: {
                    userImage,
                    avatarImage,
                    height,
                    weight,
                    waist,
                    chest,
                    cupSize,
                    skinTone
                },
                create: {
                    userId: userId,
                    userImage,
                    avatarImage,
                    height,
                    weight,
                    waist,
                    chest,
                    cupSize,
                    skinTone
                }
            })

            if(!avatar) {
                return res.status(500).send("Avatar creation failed.");
            }
        } catch(err) {
            logger.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}

export default new AvatarController();