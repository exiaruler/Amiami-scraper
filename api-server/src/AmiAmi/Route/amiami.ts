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
    if(request!=""){

    }
    resp.status(stat).json(repsonse);
});
router.post('/search/:item/:page',async (req: express.Request, resp: express.Response, next: express.NextFunction)=>{
    const search=req.params.item;
    let page="1";
    if(req.params.page){
        page=req.params.page;
    }
    if(search!=""){
        let results=await api.requestSearch(search,page);
        resp.json(results);
    }else resp.status(500).send("error");
});
module.exports = router;
