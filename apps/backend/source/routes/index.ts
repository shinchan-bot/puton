import { Express } from "express";
import userController from "../controllers/userController";

const apiV1 = `/api/v1/`;


export default (app: Express) => {
    app.use(`${apiV1}user`, userController.router);
};