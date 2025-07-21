import { Request, Response } from "express";
import commonUtils from "./utils/commonUtils.js";
import MySqlClient from "./db/db.js";
import { RowDataPacket } from "mysql2/promise";
import logger from "./utils/logger.js";

const AUTH_URL = process.env.AUTH_URL;
commonUtils.checkEnv({ AUTH_URL });

export default async function getUserMessages(req: Request, resp: Response) {
    let fromUser = req.query.from;
    const toUser = req.query.to;

    // logger.debug({ fromUser, toUser });
    if (!fromUser) {
        const rawToken = req.headers.authorization;
        const resp = await commonUtils.fetchGet(AUTH_URL, "/v1/user/verify", {
            headers: {
                Authorization: rawToken,
            },
        });

        if (resp.status != 200) {
            resp.status(400).json(
                commonUtils.errorResp(
                    `Error from auth : ${resp.json?.message} : with status ${resp.status}`
                )
            );
            return;
        }
        const user = resp.json?.data?.username;

        if (!user) {
            resp.status(400).json(
                commonUtils.errorResp("Please provide token and to")
            );
            return;
        }
        fromUser = user;
    }

    if (!fromUser || !toUser) {
        resp.status(400).json(
            commonUtils.errorResp("Both fromUser and toUser is required")
        );
        return;
    }

    const fetchMessageQuery = `
    select sndr.username as sender ,rcvr.username as receiver, message, messages.created_at from messages 
        join users as sndr on sndr.id = sender 
        join users as rcvr on rcvr.id = receiver 
        where 
            (sndr.username = ? and rcvr.username = ?) 
                or 
            (sndr.username = ? and rcvr.username = ?) 
        order by messages.created_at;
    `;

    const [userMessages] = await MySqlClient.getMySqlConnection().execute<
        RowDataPacket[]
    >(fetchMessageQuery, [fromUser, toUser, toUser, fromUser]);

    let messages = userMessages.map((row) => {
        return {
            from: row["sender"],
            to: row["receiver"],
            message: row["message"],
            createdAt: row["created_at"],
        };
    });

    // logger.debug({ messages });

    resp.status(200).json(
        commonUtils.successResp("Fetched user messages", messages)
    );
}
