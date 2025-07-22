import express, { Express } from "express";
import cors from "cors";

const configExpress = (app: Express) => {
    app.use(express.json());
    app.use(
        cors({
            origin: "*",
        })
    );
};

export default configExpress;
