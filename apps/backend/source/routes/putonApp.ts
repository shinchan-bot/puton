import { Express } from "express";
import loginController from "../controllers/loginController";
import wishlistController from "../controllers/wishlistController";
import avatarController from "../controllers/avatarController";
const apiV1 = `/api/a1/`;


export default (app: Express) => {
    app.use(`${apiV1}user`, loginController.router);
    app.use(`${apiV1}user`, wishlistController.router);
    app.use(`${apiV1}user`, avatarController.router);
};