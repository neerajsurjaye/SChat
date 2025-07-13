import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import commonUtils from "../utils/commonUtils.js";

dotenv.config({ path: ".env" });

const MYSQL_CONNECTION = process.env.MYSQL_CONNECTION;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_PORT = process.env.MYSQL_PORT;

commonUtils.checkEnv({
    MYSQL_CONNECTION,
    MYSQL_USER,
    MYSQL_DB,
    MYSQL_PASSWORD,
    MYSQL_PORT,
});

class MySqlClient {
    private static mySqlConn: Pool | null = null;

    private static createDBConnection() {
        try {
            this.mySqlConn = mysql.createPool({
                host: MYSQL_CONNECTION,
                user: MYSQL_USER,
                database: MYSQL_DB,
                password: MYSQL_PASSWORD,
                port: parseInt(MYSQL_PORT || "3306"),
            });
        } catch (err) {
            logger.error(`Error while creating mysql Connection ${err}`);
        }
    }

    public static recreateConnection() {
        this.createDBConnection();
    }

    public static getMySqlConnection(): Pool {
        if (this.mySqlConn == null) {
            this.createDBConnection();
        }
        return this.mySqlConn as Pool;
    }
}

export default MySqlClient;

// const mysqlConn: Pool = mysql.createPool({
//     host: process.env.MYSQL_CONNECTION,
//     user: process.env.MYSQL_USER,
//     database: process.env.MYSQL_DB,
//     password: process.env.MYSQL_PASSWORD,
//     port: parseInt(process.env.MYSQL_PORT || "3306"),
// });

// function getDBConnection(): Pool | null {
//     const mysqlConn: Pool | null = null;

//     try {
//         mysql.createPool({
//             host: process.env.MYSQL_CONNECTION,
//             user: process.env.MYSQL_USER,
//             database: process.env.MYSQL_DB,
//             password: process.env.MYSQL_PASSWORD,
//             port: parseInt(process.env.MYSQL_PORT || "3306"),
//         });
//     } catch (err) {
//         logger.error(`Error while creating mysql Connection ${err}`);
//     }

//     return mysqlConn;
// }
