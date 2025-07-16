import { Channel, ConsumeMessage } from "amqplib";
import HandleAmqp from "./rabbitmq/handleAmqp.js";
import logger from "./utils/logger.js";
import MySqlClient from "./db/db.js";
import { Pool, RowDataPacket } from "mysql2/promise";

async function main() {
    let handleAmqp: HandleAmqp = await HandleAmqp.getInstance();

    logger.debug("Connection initiated to rabbitmq");
    handleAmqp.addConsumer("messages", (channel: Channel) => {
        return async (message: ConsumeMessage) => {
            const parsedMessage = JSON.parse(message.content.toString());
            const mysqlConnection: Pool = MySqlClient.getMySqlConnection();

            try {
                await mysqlConnection.execute(
                    "CREATE TABLE IF NOT EXISTS messages(id INT AUTO_INCREMENT PRIMARY KEY, sender int, receiver int, message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
                );
            } catch (err) {
                logger.error("Error while trying to create table", err);
                throw new Error(err);
            }

            // Find user id

            logger.debug(
                `Got message from : ${parsedMessage.from} and send to : ${parsedMessage.to} :: message :${parsedMessage.message}`
            );
            const [ids] = await mysqlConnection.execute<RowDataPacket[]>(
                "SELECT id FROM users where username in (?, ?)",
                [parsedMessage.from, parsedMessage.to]
            );

            logger.debug(ids);

            try {
                await mysqlConnection.execute(
                    "INSERT INTO messages(sender, receiver, message, created_at) values(?,?,?,?)",
                    [
                        ids[0].id,
                        ids[1]?.id || ids[0].id, //if id[1] doesn't exist(In case of sender and receiver is same) replaces id[1] with id[0]
                        parsedMessage.message,
                        new Date(parsedMessage.timestamp),
                    ]
                );
                channel.ack(message);
            } catch (err) {
                logger.error(
                    "Error while trying to insert data into message table",
                    err
                );
            }
        };
    });
}

main();
