import HandleAmqp from "./rabbitmq/handleAmqp.js";
import logger from "./utils/logger.js";

async function main() {
    const handleAmqp: HandleAmqp = await HandleAmqp.getInstance();

    handleAmqp.addConsumer("messages", (message) => {
        logger.debug(message);
        logger.debug(JSON.parse(message.content.toString()));
    });
}

main();
