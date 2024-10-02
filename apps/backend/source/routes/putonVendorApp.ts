import { Express } from "express";
import { successResponse } from "../utils/helper/api-handler";
// import loginController from "../controllers/loginController";

const apiV1 = `/api/v1/`;


export default (app: Express) => {
    app.use(`${apiV1}vendor`, (req: any, res: any) => { res.status(200).send({ message: "Vendor Route is working fine", success: true }) });
};