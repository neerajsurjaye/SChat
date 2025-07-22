import express, { Express, Router } from "express";
import {
    findMessages,
    generateJWT,
    registerUser,
    searchUser,
    verifyJWT,
} from "./services.js";
import logger from "./utils/logger.js";

const routesV1 = (): Router => {
    const router: Router = express.Router();
    router.post("/user", registerUser);
    router.get("/user/verify", verifyJWT);
    router.post("/user/login", generateJWT);
    router.get("/user/search", searchUser);
    router.get("/message", findMessages);

    return router;
};

const registerRoutes = (app: Express) => {
    logger.info("Registering Routes");
    app.use("/v1", routesV1());
};

export default registerRoutes;
