import { UtilTool } from "../Util/UtilTool";
import { Response } from "../interface/responseInterface";
export class AmiAmi extends UtilTool{

    public requestConfig(){
        var config:any={
            method:"GET",
            impersonate: "firefox-109",
            headers:{
              'X-User-Key':'amiami_dev',
              'Sec-Fetch-Mode':'cors',
            },
            //"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
            //signal:AbortSignal.timeout(5000)
        };
        return config;
    }
    public urlSet(search:string,pageNum:string){
        return "https://api.amiami.com/api/v1.0/items?pagemax=50&pagecnt="+pageNum+"&lang=eng&s_keywords="+search+"&s_sortkey=preowned&s_st_condition_flg=1";
    }
    // gather search results and send to post API in that request
    public async requestSearchPost(search:string,postApi:string,config:Object={},payload:Object={}){
        var response:Response={
            success: false,
            statusCode: 200,
            messageResponse: ""
        };
        let page=1;
        let url=this.urlSet(search,page.toString());
        let error=200;
        let firstRequest=await this.loopToGetRequest(url);
        let transactionId=new Date().toUTCString();
        if(firstRequest!=null){
            let jsonOutput={
                search:search,
                items:[],
                total:0,
                finalRequest:false,
                transactionId:transactionId,
                payload:payload
            };
            let data=firstRequest;
            if(data.search_result.total_results>0){
                let loop=this.calculateLoop(data.search_result.total_results);
                jsonOutput.items=data.items;
                jsonOutput.total=data.items.length;
                if(loop==1){
                    jsonOutput.finalRequest=true;
                }
                let post=await this.postRequest(postApi,jsonOutput,config);
                if(post==200&&loop>1){
                        page++;
                        for(var i=page; i<=loop; i++){
                            let request=await this.loopToGetRequest(this.urlSet(search,page.toString()));
                            if(request!=null){
                                data=request
                                jsonOutput.items=data.items;
                                jsonOutput.total=data.items.length;
                                if(i==loop){
                                    jsonOutput.finalRequest=true;
                                }
                                post=await this.postRequest(postApi,jsonOutput,config);
                            }
                        }
                }else
                {
                    error=post;
                    response.statusCode=post;
                }
            }else response.statusCode=404;
        }
        if(response.statusCode==200){
            response.success=true;
            response.messageResponse="success";
        }
        return response;
    }
    public async requestSearch(search:string,page:string){
        let results=null;
        let url=this.urlSet(search,page);
        results= await this.loopToGetRequest(url);
        return results;
    }
    
   public async loopToGetRequest(url:string,limitRequest?:number){
    let ok=false;
    let results=null;
    let count=0;
    while(!ok){
        if(count>0){
            // generate random delay
            let rand=Math.random() * (10000 - 1000) + 1000;
            await this.delay(rand);
        }
        let request=await fetch(url,this.requestConfig());
        if(await request.ok){
            results=await request.json();
            ok=true;
        }
        count++;
    }
    console.log("request count total for "+url+" total:"+count);
    return results;
   }
    // send results to target api
    public async postRequest(api:string,json:any,config:any={}){
        let postConfig={
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(json)
        };
        let returnReponse={ok:false,status:500};
        let status=500;
        try{
            let postRequest=await fetch(api,postConfig);
            status=await postRequest.status;
            returnReponse={ok:postRequest.ok,status:status};
        }catch(error){

        }
        return status;
    }
    // calculate loop of requests
    public calculateLoop(results:number){
        let res=1;
        res=results/50;
        let remainder=results%50;
        if(remainder>0&&res>0){
            res=res+1;
        }
        return res;
    }
}