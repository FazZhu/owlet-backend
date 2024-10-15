import Koa from 'koa'
import * as console from "console";
import * as process from "process";
const app = new Koa();
const port = process.env.PORT ?? 3000;

app.listen(port,()=>{
    console.log("Hello KOA! Now service is running on PORT " + port);
})
