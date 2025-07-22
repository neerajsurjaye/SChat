import MySqlClient from "./db.js";

function init() {
    MySqlClient.getMySqlConnection().query(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    MySqlClient.getMySqlConnection().query(`
    CREATE TABLE IF NOT EXISTS  messages (
        id int NOT NULL AUTO_INCREMENT,
        sender int DEFAULT NULL,
        receiver int DEFAULT NULL,
        message text,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY time_sort_message (created_at DESC)
    ) `);

    // mysqlConn.query(`INSERT INTO users(username, password) values("spec", "spec")`);
}

export default init;
