import {Logger, createLogger, format, transports} from "winston";
const logger:Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 时间戳
        format.errors({ stack: true }), // 错误堆栈
        format.splat(), // 支持格式化字符串
        format.json() // 输出 JSON 格式
    ),
    transports: [
        new transports.Console(), // 控制台输出
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // 错误日志文件
        new transports.File({ filename: 'logs/combined.log' }) // 所有日志文件
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ]
})

export default logger;