import { Express } from "express";
import services from "./services.js";
import logger from "./logger.js";

const registerRoutes = (app: Express) => {
    logger.info("Registering Routes");
    app.post("/user", services.registerUser);
    app.get("/verify", services.verifyJWT);
    app.get("/login", services.generateJWT);
};

export default registerRoutes;
