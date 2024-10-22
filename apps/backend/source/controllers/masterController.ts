import { Response, Request, Router, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { verifyToken } from '../utils/auth';
import masterService from '../services/masterService';
import { MasterAttrs } from "../utils/Enums/master";

const prisma = new PrismaClient();

class MasterController {
    router = Router();

    constructor() {
        this.intializeRoutes();

    }
    public intializeRoutes() {
        this.router.get("/", verifyToken, this.getMasterData); //remove verifytonek 
    }

    private getMasterData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { attributes } = req.query as any;
            const data = await masterService.masterDataHandler(attributes);
            return res.status(200).json({ valid: true, message: "working" })
        } catch (error) {
            logger.error(error);
            return res.status(500).send({ valid: false, message: "Internal Server Error" });
        }
    }
}
export default new MasterController();