import express, { Express, Router } from "express";
import {
    generateJWT,
    pong,
    registerUser,
    searchUser,
    verifyJWT,
} from "./services.js";

const routesV1 = (): Router => {
    const router: Router = express.Router();
    router.post("/user", registerUser);
    router.get("/user/verify", verifyJWT);
    router.post("/user/login", generateJWT);
    router.get("/user/search", searchUser);
    router.get("/ping-v1", pong);
    return router;
};

const registerRoutes = (app: Express) => {
    app.use("/v1", routesV1());
};

export default registerRoutes;
