import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config({ path: ".env" });

logger.info(process.env.MYSQL_CONNECTION);

const mysqlConn: Pool = mysql.createPool({
    host: process.env.MYSQL_CONNECTION,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
});

export default mysqlConn;
