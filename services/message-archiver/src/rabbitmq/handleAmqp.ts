import amqplib, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import dotenv from "dotenv";
import commonUtils from "../utils/commonUtils.js";
import logger from "../utils/logger.js";
import { setTimeout } from "timers/promises";

dotenv.config({ path: ".env" });

const RABBIT_URL = process.env.RABBIT_URL;

commonUtils.checkEnv({ RABBIT_URL });

class HandleAmqp {
    connection: ChannelModel;
    channel: Channel;
    isInitializing = false;

    static instance: HandleAmqp;

    private constructor() {}

    public static async getInstance() {
        if (!HandleAmqp.instance) {
            HandleAmqp.instance = new HandleAmqp();
            await HandleAmqp.instance.init();
        }
        return HandleAmqp.instance;
    }

    private async init() {
        if (this.isInitializing) return;
        this.isInitializing = true;

        try {
            this.connection = await amqplib.connect(RABBIT_URL);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue("messages", { durable: true });

            this.connection.on("close", () => {
                this.channel = null;
                this.connection = null;
            });

            this.connection.on("error", (err) => {
                logger.error(`An error occured with amqplib ${err}`);
            });
        } catch (err) {
            const error: string = `Got exception while trying to connect with rabbitmq::\n${err}`;
            logger.error(error);
            throw new Error(error);
        } finally {
            this.isInitializing = false;
        }
    }

    public async pushMessage(msg: any) {
        logger.debug("Pushing to queue");
        const stringifiedMsg = JSON.stringify(msg);

        let retryCount = 2;

        while (retryCount > 0) {
            try {
                if (!this.channel) {
                    await this.init();
                }

                this.channel.sendToQueue(
                    "messages",
                    Buffer.from(stringifiedMsg),
                    { persistent: true }
                );
                return;
            } catch (err) {
                logger.error(
                    `Got exception while trying to push message to queue`,
                    err
                );
                await setTimeout(1000);
            }
            retryCount--;
        }
    }

    public async addConsumer(
        queueName: string,
        callback: (channel: Channel) => (message: ConsumeMessage) => any
    ) {
        try {
            const cb = callback(this.channel);
            await this.channel.consume(queueName, cb);
        } catch (err) {
            logger.error(`Error while consuming messages :: `, err);
        }
    }
}

export default HandleAmqp;
