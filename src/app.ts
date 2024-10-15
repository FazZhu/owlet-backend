import Koa from 'koa'
import * as process from "process";
import logger from "@/middlewares/logger";
import 'reflect-metadata'

const app = new Koa();
const port = process.env.PORT ?? 3000;

app.listen(port,()=>{
    // console.log("Hello KOA! Now service is running on PORT " + port);
    logger.info("Hello KOA! Now service is running on PORT " + port)
})
