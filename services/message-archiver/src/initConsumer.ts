import { Channel, ConsumeMessage } from "amqplib";
import HandleAmqp from "./rabbitmq/handleAmqp.js";
import logger from "./utils/logger.js";
import MySqlClient from "./db/db.js";
import { Pool, RowDataPacket } from "mysql2/promise";

export default async function initConsumer() {
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

            //GIVES RESULT IN SAME ORDER FROM TO ORDER DOESN'T MATTER
            // const [ids] = await mysqlConnection.execute<RowDataPacket[]>(
            //     "SELECT id FROM users where username in (?, ?)",
            //     [parsedMessage.from, parsedMessage.to]
            // );

            const [from] = await mysqlConnection.execute<RowDataPacket[]>(
                "SELECT id FROM users where username in (?)",
                [parsedMessage.from]
            );

            const [to] = await mysqlConnection.execute<RowDataPacket[]>(
                "SELECT id FROM users where username in (?)",
                [parsedMessage.to]
            );

            logger.debug({ from, to });

            try {
                await mysqlConnection.execute(
                    "INSERT INTO messages(sender, receiver, message, created_at) values(?,?,?,?)",
                    [
                        from[0].id,
                        to[0].id,
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
