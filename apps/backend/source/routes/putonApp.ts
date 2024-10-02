import { Express } from "express";
import loginController from "../controllers/loginController";

const apiV1 = `/api/a1/`;


export default (app: Express) => {
    app.use(`${apiV1}user`, loginController.router);
};