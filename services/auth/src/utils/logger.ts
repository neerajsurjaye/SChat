import winston from "winston";

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
