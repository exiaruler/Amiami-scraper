import * as express from 'express';
const router:express.Router=express.Router();
import { AmiAmi } from '../AmiAmi';
const api=new AmiAmi();

router.post('/',async (req: express.Request, resp: express.Response, next: express.NextFunction)=>{
    resp.send("hello");
});
router.post('/request-post',async (req: express.Request, resp: express.Response, next: express.NextFunction)=>{
    const {search,postApi,config}=req.body;
    var repsonse={error:""};
    var stat=200;
    var request=await api.requestSearchPost(search,postApi,config);
    if(request!=200){
        repsonse.error="Post API does not exist or something went wrong. error code";
        resp.status(500).json(repsonse);
    }else resp.status(stat).json(repsonse);
});
router.get('/search/:item/:page',async (req: express.Request, resp: express.Response, next: express.NextFunction)=>{
    const search=req.params.item;
    let page="1";
    if(req.params.page){
        page=req.params.page;
    }
    if(search!=""){
        let results=await api.requestSearch(search,page);
        if(typeof results!='string'){
            resp.json(results);
        }else resp.send("AmiAmi status:"+results+" Explaination: Amiami regulates traffic control the best advice is send request within interval amounts of time or try again later");
    }else resp.status(500).send("error");
});
module.exports = router;
