import http from "http";
import { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();
const PORT = process.env.PORT || 8000;


const router: Express = app;

router.get('/', (req: Request, res: Response) => {
  res.status(200).send(`App listening on Port: ${PORT}`);
})

/** Server */
const httpServer = http.createServer(router);
httpServer.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
)