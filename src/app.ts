import Koa from 'koa'
import * as console from "console";
const app = new Koa();
app.listen(3000,()=>{
    console.log("Hello KOA! Now is running on PORT 3000");
})
