import { config, createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, align, colorize } = format;

const exceptionHandlers = [
    new transports.File({ filename: 'logs/exception.log' })
];

export const log = createLogger({
    levels: config.syslog.levels,
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        align(),
        printf(info => {
            const { timestamp, level, message, ...args } = info;

            return `${timestamp} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        })
    ),
    exceptionHandlers,
    transports: [
        new transports.File({ filename: 'logs/wavesms.log', level: 'debug' }),
        new transports.Console({ level: 'info' }),
    ],
    exitOnError: false
});