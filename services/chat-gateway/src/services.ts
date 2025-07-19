import { Request, Response } from "express";
import commonUtils from "./utils/commonUtils.js";
import logger from "./utils/logger.js";

const AUTH_URL = process.env.AUTH_URL;
const ARCHIVER_URL = process.env.ARCHIVER_URL;
commonUtils.checkEnv({ AUTH_URL, ARCHIVER_URL });

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

export async function findMessages(req: Request, res: Response) {
    let to = req.query.to as string;

    const rawToken = req.headers.authorization;

    const resp = await commonUtils.fetchGet(AUTH_URL, "/v1/user/verify", {
        headers: {
            Authorization: rawToken,
        },
    });
    if (resp.status != 200) {
        res.status(400).json(
            commonUtils.errorResp(
                `Error from auth : ${resp.json?.message} : with status ${resp.status}`
            )
        );
        return;
    }
    const user = resp.json?.data?.username;

    if (!user || !to) {
        res.status(400).json(
            commonUtils.errorResp("Please provide token and to")
        );
        return;
    }

    let messages = await commonUtils.fetchGet(
        ARCHIVER_URL,
        `/v1/message?from=${user}&to=${to}`
    );

    res.status(messages.status || 500).json(messages.json);
}
