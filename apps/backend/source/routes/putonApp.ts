import { Express } from "express";
import loginController from "../controllers/loginController";
import wishlistController from "../controllers/wishlistController";
import avatarController from "../controllers/avatarController";
import masterController from "../controllers/masterController";

const apiV1 = `/api/v1/`;


export default (app: Express) => {
    app.use(`${apiV1}user`, loginController.router);
    app.use(`${apiV1}user`, avatarController.router);
    app.use(`${apiV1}wishlist`, wishlistController.router);
    app.use(`${apiV1}master`, masterController.router)
};