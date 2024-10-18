import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import logger from "../utils/logger";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class WishlistController {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post("/wishlist", this.wishlistAdd);
        this.router.get("/wishlist", this.wishlist);
    }

    private wishlistAdd = async (req: Request, res: Response) => {
        try {
            const {userId, source, user_type, productId} : {
                userId: number,
                source: string,
                user_type: string,
                productId: number
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
            const wishlistItem = await prisma.wishlistItem.upsert({
                where: {
                    userId_productId: { 
                        userId: userId,
                        productId: productId 
                    }
                },
                update: {},
                create: {
                    userId: userId,
                    productId: productId
                }
            });

            if(!wishlistItem) {
                return res.status(500).send("Failed to add item to wishlist.")
            }
            return res.status(200).send("Item added to wishlist.");            

        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server Error.");
        }
    };

    private wishlist = async (req: Request, res: Response) => {
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
                return res.status(503).send("Invalid Token");
            }
            //TODO: Add token expiry check
            const wishlistItem = await prisma.wishlistItem.findMany({
                where: {
                    userId: userId,
                }
            });

            if(!wishlistItem) {
                return res.status(200).json({});
            }
            return res.status(200).json(wishlistItem);            

        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server Error.");
        }
    };
}

export default new WishlistController();