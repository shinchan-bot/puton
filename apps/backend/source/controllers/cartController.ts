import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import logger from "../utils/logger";
dotenv.config();
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CartController {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get("/cart", this.cart);
        this.router.post("/cart-add", this.cartAdd);
    }

    private cart = async (req:Request, res: Response) => {
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
            const cartItem = await prisma.cartItem.findMany({
                where: {
                    userId: userId
                }
            });

            if(!cartItem) {
                return res.status(200).json({});
            }
            return res.status(200).json(cartItem);

        } catch(err) {
            logger.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }

    private cartAdd = async (req: Request, res: Response) => {
        try {
            const {userId, source, user_type, productId, quantity} : {
                userId: number,
                source: string,
                user_type: string,
                productId: number,
                quantity: number
            } = req.body;

            const accessToken = req.headers.authorization;

            if(!accessToken) {
                return res.status(503).send("Bad request.");
            }
            const jwtDecode = jwt.verify(accessToken, process.env.PRIVATE_ACCESS_KEY as string);

            if(undefined === jwtDecode) {
                return res.status(503).send("Invalid Token");
            }

            //TODO: Add token expirt check
            const cartItem = await prisma.cartItem.upsert({
                where: {
                    userId_productId: { 
                        userId: userId,
                        productId: productId 
                    }
                },
                update: {
                    quantity: quantity
                },
                create: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity
                }
            })
        } catch(err) {
            logger.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}

export default new CartController();