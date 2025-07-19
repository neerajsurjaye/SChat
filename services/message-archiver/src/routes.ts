import express, { Express, Router } from "express";
import logger from "./utils/logger.js";
import getUserMessages from "./services.js";

const routesV1 = (): Router => {
    const router: Router = express.Router();
    router.get("/message", getUserMessages);
    return router;
};

const registerRoutes = (app: Express) => {
    logger.info("Registering Routes");
    app.use("/v1", routesV1());
};

export default registerRoutes;
