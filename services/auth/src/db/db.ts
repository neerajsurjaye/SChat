import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config({ path: ".env" });

logger.info(process.env.MYSQL_CONNECTION);

class MySqlClient {
    private static mySqlConn: Pool | null = null;

    private static createDBConnection() {
        try {
            this.mySqlConn = mysql.createPool({
                host: process.env.MYSQL_CONNECTION,
                user: process.env.MYSQL_USER,
                database: process.env.MYSQL_DB,
                password: process.env.MYSQL_PASSWORD,
                port: parseInt(process.env.MYSQL_PORT || "3306"),
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
