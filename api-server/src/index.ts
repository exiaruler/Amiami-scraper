import express from 'express';
import cors from 'cors';
const amiami=require('./AmiAmi/Route/amiami');
const http = require("http");
const port = 3000;

const app = express()
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

app.get('/', async (req:any, res:any) => {
  var config:any={
    method:"GET",
    //"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    //impersonate: "firefox-109",
    headers:{
      'X-User-Key':'amiami_dev',
      'Sec-Fetch-Mode':'cors',
    },
  };
  const request=await fetch("https://api.amiami.com/api/v1.0/items?pagemax=50&pagecnt=1&lang=eng&s_keywords=kamen rider geats&s_sortkey=preowned&s_st_condition_flg=1",config);
  let json=await request.json();
  let stat=await request.status;
  console.log(json);
  console.log(stat);
  res.json(json);
  //res.send('Server online')
})
/*
app.get('/amiami', async (req:any, res:any) => {
  const request=await fetch("https://api.amiami.com/api/v1.0/items?pagemax=50&pagecnt=1&lang=eng&s_keywords=kamen rider geats&s_sortkey=preowned&s_st_condition_flg=1",config);
  let json=await request.json();
  let stat=await request.status;
  console.log(json);
  console.log(stat);
  res.json(json);
  //res.send('Server online')
})*/
app.use('/amiami',amiami);

app.listen(port,async() => {
  console.log(`listening on port ${port}`)
  console.log("http://localhost:"+port);
})


