import express, { Express } from "express";
const configExpress = (app: Express) => {
    app.use(express.json());
};

export default configExpress;
