import logger from "../utils/logger.js";
import MySqlClient from "./db.js";

async function initdb() {
    try {
        await MySqlClient.getMySqlConnection().query(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    } catch (err) {
        logger.error("Error while initialzing db", err);
    }
}

export default initdb;
