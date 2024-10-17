import { Express } from "express";
import loginController from "../controllers/loginController";
import wishlistController from "../controllers/wishlistController";
const apiV1 = `/api/a1/`;


export default (app: Express) => {
    app.use(`${apiV1}user`, loginController.router);
    app.use(`${apiV1}user`, wishlistController.router);
};