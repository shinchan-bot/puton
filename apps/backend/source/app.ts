import express, { Express } from "express";
import cors from "cors";
import potonRoutes from "./routes/putonApp";
import putonDelivery from "./routes/putonDelivery";
import putonVendor from "./routes/putonVendor";

class App {
    public app: Express;
    constructor() {
        this.app = express();
        this.config();
    }
    private config() {

        this.app.use(express.json());

        /** Parse the request */
        this.app.use(express.urlencoded({ extended: true, limit: "1mb" }));

        /** Takes care of JSON data */
        this.app.use(express.json({ limit: "1mb" }));

        /** RULES OF OUR API */
        const corsOptions = {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: true,
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        this.app.use(cors(corsOptions));

        /** Load routes */
        potonRoutes(this.app) // main-application
        putonDelivery(this.app) // Delivery-app
        putonVendor(this.app) // puton-vendor


    }
}
export default new App().app;