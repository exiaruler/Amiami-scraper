import express from 'express';
import cors from 'cors';
const amiami=require('./AmiAmi/Route/amiami');
const http = require("http");
const port = process.env.PORT || 3000;;
const app = express()
app.use(cors());
app.use(express.json());
//const server = http.createServer(app);
function createRouteUrl(route:String){
  return "/api/"+route;
}

app.get(createRouteUrl(""), async (req:any, res:any) => {
  res.send("Active");
})
app.use(createRouteUrl('amiami'),amiami);
app.listen(port,async() => {
  console.log(`listening on port ${port}`)
  console.log("http://localhost:"+port+"/api");
})


