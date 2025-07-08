import { NextFunction, Request, Response } from "express";
import logger from "./logger.js";
import util from "./util.js";
import mysqlConn from "./db.js";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

async function registerUser(req: Request, res: Response, next: NextFunction) {
    const username: string = req.body?.username;
    const password: string = req.body?.password;

    if (username == null || password == null) {
        res.status(400).json(
            util.errorResp("Username or password is not defined", {
                username,
                password,
            })
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await mysqlConn.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ?",
        [username]
    );

    if (existingUser.length > 0) {
        res.status(400).send(util.errorResp("User Already Exists"));
        return;
    }

    try {
        await mysqlConn.query(
            "INSERT INTO users(username, password) values(?,?)",
            [username, hashedPassword]
        );
    } catch (err) {
        logger.error(`Error while inserting to db : ${err}`);
        res.status(500).send(util.errorResp("Internal Server Error"));
    }

    res.status(200).send(
        util.successResp("Successfully Inserted into database")
    );

    //return jwt back to user
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    logger.info("Verifying JWT");
};

const generateJWT = (req: Request, res: Response, next: NextFunction) => {};

const services = {
    registerUser,
    verifyJWT,
    generateJWT,
};

export default services;
