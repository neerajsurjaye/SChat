import express, { Express, Router } from "express";
import services from "./services.js";
import logger from "./utils/logger.js";

const routesV1 = (): Router => {
    const router: Router = express.Router();
    router.post("/user", services.registerUser);
    router.get("/user/verify", services.verifyJWT);
    router.post("/user/login", services.generateJWT);
    return router;
};

const registerRoutes = (app: Express) => {
    logger.info("Registering Routes");
    app.use("/v1", routesV1());
};

export default registerRoutes;
