import { NextFunction, Request, Response, Router } from "express";
import logger from "../utils/logger";
import userService from "../services/userService";
import { validateHeaderName } from "http";

class CaseController {
    router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get("/register", this.userRegister);
        this.router.get("/login", this.login);
    }


    private userRegister = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { startDate, endDate } = req.query;

            const data = await userService.aggregatedDataHandler(startDate, endDate);
            return res.status(data.statusCode).send(data.responseBody);
        } catch (err) {
            logger.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }

    private login = async (req: Request, res: Response) => {
        try {

        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }
}

export default new CaseController();