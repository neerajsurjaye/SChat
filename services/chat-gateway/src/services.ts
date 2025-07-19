import { Request, Response } from "express";
import commonUtils from "./utils/commonUtils.js";
import logger from "./utils/logger.js";

let AUTH_URL = process.env.AUTH_URL;
commonUtils.checkEnv({ AUTH_URL });

export async function registerUser(req: Request, res: Response) {
    let body = { username: req.body.username, password: req.body.password };
    let authResp = await commonUtils.fetchPost(AUTH_URL, "/v1/user", body);
    res.status(authResp.status || 500).json(authResp.json);
}
export async function verifyJWT(req: Request, res: Response) {
    let authToken = req.headers.authorization;
    logger.debug(authToken);
    let authResp = await commonUtils.fetchGet(AUTH_URL, "/v1/user/verify", {
        headers: { AUTHORIZATION: authToken },
    });
    res.status(authResp.status || 500).json(authResp.json);
}
export async function generateJWT(req: Request, res: Response) {
    let body = { username: req.body.username, password: req.body.password };
    let authResp = await commonUtils.fetchPost(
        AUTH_URL,
        "/v1/user/login",
        body
    );
    logger.debug(authResp);
    res.status(authResp.status || 500).json(authResp.json);
}

export async function searchUser(req: Request, res: Response) {
    let username = req.query.username;

    if (!username) {
        res.status(400).json(commonUtils.errorResp("Please provide username"));
        return;
    }

    let userResp = await commonUtils.fetchGet(
        AUTH_URL,
        `/v1/user/search?username=${username}`
    );

    res.status(userResp.status || 500).json(userResp.json);
}
