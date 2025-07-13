import { Request, Response } from "express";
import logger from "./utils/logger.js";
import util from "./utils/commonUtils.js";
import MySqlClient from "./db/db.js";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Pool } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET;

util.checkEnv({ JWT_SECRET });

async function registerUser(req: Request, res: Response) {
    const username: string = req.body?.username;
    const password: string = req.body?.password;

    const mysqlConn: Pool = MySqlClient.getMySqlConnection();

    if (username == null || password == null) {
        res.status(400).json(
            util.errorResp("Username or password is not defined", {
                username,
                password,
            })
        );
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await mysqlConn.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ?",
        [username]
    );

    if (existingUser.length > 0) {
        res.status(400).json(util.errorResp("User Already Exists"));
        return;
    }

    try {
        await mysqlConn.query(
            "INSERT INTO users(username, password) values(?,?)",
            [username, hashedPassword]
        );
    } catch (err) {
        logger.error(`Error while inserting to db : ${err}`);
        res.status(500).json(util.errorResp("Internal Server Error"));
        return;
    }

    res.status(200).json(
        util.successResp("Successfully Inserted into database")
    );

    //return jwt back to user
}

const verifyJWT = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    const rawJwtToken = authHeader?.split(" ")[1];

    if (!authHeader || !rawJwtToken) {
        res.status(400).json(
            util.successResp("AuthHeader not properly defined")
        );
        return;
    }

    const jwtToken: string = String(rawJwtToken);

    const jwtSecret: string = String(JWT_SECRET);

    let token: JwtPayload;
    try {
        token = jwt.verify(jwtToken, jwtSecret) as JwtPayload;
    } catch (err) {
        logger.error(`Invalid Token ${err}`);
        res.status(400).json(util.errorResp("Invalid token"));
        return;
    }

    let username = token.username;

    res.status(200).json(
        util.successResp("JWT verified", { username: username })
    );
};

const generateJWT = async (req: Request, res: Response) => {
    const username: string = req.body?.username;
    const password: string = req.body?.password;

    const mysqlConn: Pool = MySqlClient.getMySqlConnection();

    const [result] = await mysqlConn.execute<RowDataPacket[]>(
        "SELECT username, password FROM users WHERE username = ?",
        [username]
    );

    if (result.length == 0) {
        res.status(404).json(util.errorResp("User doesn't exist"));
        return;
    }

    const hashedPassword = result[0]["password"];
    logger.debug(hashedPassword);
    let isValidPassword: boolean = await bcrypt.compare(
        password,
        hashedPassword
    );

    if (!isValidPassword) {
        res.status(401).json(util.errorResp("Wrong password"));
        return;
    }

    const jwtSecret: string = String(JWT_SECRET);
    const resJwt: string = jwt.sign({ username: username }, jwtSecret);

    res.status(200).json(util.successResp("JWT created", resJwt));
};

const services = {
    registerUser,
    verifyJWT,
    generateJWT,
};

export default services;
