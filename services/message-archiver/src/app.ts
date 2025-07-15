import { Channel, ConsumeMessage } from "amqplib";
import HandleAmqp from "./rabbitmq/handleAmqp.js";
import logger from "./utils/logger.js";
import MySqlClient from "./db/db.js";
import { Pool } from "mysql2/promise";

async function main() {
    let handleAmqp: HandleAmqp = await HandleAmqp.getInstance();

    logger.debug("Connection initiated to rabbitmq");
    handleAmqp.addConsumer("messages", (channel: Channel) => {
        return async (message: ConsumeMessage) => {
            const parsedMessage = JSON.parse(message.content.toString());
            const mysqlConnection: Pool = MySqlClient.getMySqlConnection();

            try {
                await mysqlConnection.execute(
                    "CREATE TABLE IF NOT EXISTS messages(id INT AUTO_INCREMENT PRIMARY KEY, sender VARCHAR(255), receiver VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
                );
            } catch (err) {
                logger.error("Error while trying to create table", err);
                throw new Error(err);
            }

            try {
                await mysqlConnection.execute(
                    "INSERT INTO messages(sender, receiver, message, created_at) values(?,?,?,?)",
                    [
                        parsedMessage.from,
                        parsedMessage.to,
                        parsedMessage.message,
                        new Date(parsedMessage.timestamp),
                    ]
                );
                channel.ack(message);
            } catch (err) {
                logger.error("Error while trying to start consumer", err);
                throw new Error(err);
            }
        };
    });
}

main();
