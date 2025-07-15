import MySqlClient from "./db.js";

function init() {
    MySqlClient.getMySqlConnection().query(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // mysqlConn.query(`INSERT INTO users(username, password) values("spec", "spec")`);
}

export default init;
