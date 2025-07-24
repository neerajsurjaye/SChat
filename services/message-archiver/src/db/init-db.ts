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

        await MySqlClient.getMySqlConnection().query(`
    CREATE TABLE IF NOT EXISTS  messages (
        id int NOT NULL AUTO_INCREMENT,
        sender int DEFAULT NULL,
        receiver int DEFAULT NULL,
        message text,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY time_sort_message (created_at DESC)
    ) `);

        await MySqlClient.getMySqlConnection().query(`
    CREATE INDEX time_sort_message ON messages(created_at DESC)    
    `);
    } catch (err) {
        logger.error("Error while initialzing db", err);
    }
}

export default initdb;
