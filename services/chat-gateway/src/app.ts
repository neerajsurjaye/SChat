import express, { Express, NextFunction, Request, Response } from "express";

let app: Express = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Chat Gateway test");
});

app.listen(5000, () => {
    console.log("Listening on 5000");
});
