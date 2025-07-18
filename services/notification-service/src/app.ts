import express, { Express, NextFunction, Request, Response } from "express";

const app: Express = express();

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.send("Notification Test");
});

app.listen(5000, () => {
    console.log("Listening on 5000");
});
