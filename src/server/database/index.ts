import * as process from "process";
import {DataSource} from "typeorm";
import winston from "winston";
import logger from "@/middlewares/logger";
import {mysqlConnect, MysqlDatabaseTypes} from "@/server/database/mysql";
import {redisConnect, RedisDatabaseTypes} from "@/server/database/redis";

type Uri = {
    database:{
        type : ["mysql","redis"] | ["mysql"];
        mysql :{
            host: string;
            port: number;
            username: string;
            password: string;
            database: string
        }[],
        redis?:{
            host:string;
            port: number
        }[],
    },
    global:{
        host:string;
        protocol: 'http' | 'https' | 'ws' | 'wss'
        port:number
    }
}

const getUri: () => Uri = (): Uri => {
    if (process.env.NEED_REDIS === 'TRUE') {
        return {
            database: {
                type: ["mysql", "redis"],
                mysql: [
                    {
                        host: process.env.MYSQL_HOST ?? 'localhost',
                        port: Number(process.env.MYSQL_PORT) ?? 3306,
                        username: process.env.MYSQL_USERNAME ?? 'root',
                        password: process.env.MYSQL_PASSWORD ?? '',
                        database: process.env.MYSQL_DATABASE ?? 'owletdb',
                    }
                ],
                redis: [
                    {
                        host: process.env.REDIS_HOST ?? 'localhost',
                        port: Number(process.env.REDIS_PORT) ?? 6379,
                    },
                ],
            },
            global: {
                host: process.env.HOST ?? 'localhost',
                protocol: 'http',
                port: Number(process.env.PORT) ?? 3000,
            }
        };
    } else {
        return {
            database: {
                type: ["mysql"],
                mysql: [
                    {
                        host: process.env.MYSQL_HOST ?? 'localhost',
                        port: Number(process.env.MYSQL_PORT) ?? 3306,
                        username: process.env.MYSQL_USERNAME ?? 'root',
                        password: process.env.MYSQL_PASSWORD ?? '',
                        database: process.env.MYSQL_DATABASE ?? 'owletdb',
                    }
                ],
            },
            global: {
                host: process.env.HOST ?? 'localhost',
                protocol: 'http',
                port: Number(process.env.PORT) ?? 3000,
            }
        };
    }
};

const handleConnection = (): DataSource =>{
    const uri = getUri();

    const __type = (uri.database.type instanceof Array) ?[...new Set(uri.database.type)] :(logger.error("配置文件出错"),[])
    const arrayCheck = (element:string)=> element !== "mysql" && element !== 'redis'
    if(__type.some(arrayCheck)){
        logger.error("不支持的数据库类型");
        throw new Error("不支持的数据库类型");
    }
    let __tempDataSource:DataSource;
    if (__type.length === 2 && uri.database.redis.length > 0){
        const connection: DataSource = redisConnect(uri.database as RedisDatabaseTypes)
        __tempDataSource = connection
        /**
         * some companies would like to use their own auth database rather than the default one
         * Copy the redis.ts or mysql.ts, and change the name of the class to your own class name
         * Then, use the new class to connect to your own database
         * For example, if you want to connect to your own auth database, you can copy the redis.ts and change the name to RedisAuth
         * example: ``` const authConnect = new RedisAuth() ```
         * ``` await authConnect.connect(uri.database as RedisDatabaseTypes) ```
         * ```
         */
    } else if (__type.length === 1 && __type[0] === "mysql") {
        const connection: DataSource = mysqlConnect(uri.database as MysqlDatabaseTypes)
        __tempDataSource = connection
    }
    return __tempDataSource;
}
const database = getUri();
export const handleDataSource = handleConnection();
export default database;