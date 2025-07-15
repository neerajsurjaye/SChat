import winston from "winston";
import { cli } from "winston/lib/winston/config/index.js";
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    // level: "info",
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        winston.format.align(),
        winston.format.printf(
            (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
