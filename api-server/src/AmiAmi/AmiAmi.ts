import { UtilTool } from "../Util/UtilTool";
//const util=require("../Util/UtilTool");
//import { CurlImpersonate } from "node-curl-impersonate";
export class AmiAmi extends UtilTool{

    public requestConfig(){
        var config:any={
            method:"GET",
            impersonate: "firefox-109",
            headers:{
              'X-User-Key':'amiami_dev',
              //'Sec-Fetch-Mode':'cors',
            },
        };
        return config;
    }
    public urlSet(search:string,pageNum:string){
        return "https://api.amiami.com/api/v1.0/items?pagemax=50&pagecnt="+pageNum+"&lang=eng&s_keywords="+search+"&s_sortkey=preowned&s_st_condition_flg=1";
    }
    // gather search results and send to post API in that request
    public async requestSearchPost(search:string,postApi:string,config?:JSON){
        let page=1;
        let url=this.urlSet(search,page.toString());
        let error="OK";
        let firstRequest=await this.fetch(url,this.requestConfig());
        let status=await firstRequest.status;
        if(status==200){
            let jsonOutput={
                items:[]
            };
            var data=await firstRequest.json();
            if(data.search_result.total_results>0){
                var loop=this.calculateLoop(data.search_result.total_results);
                jsonOutput.items=data.items;
                var post=await this.postRequest(postApi,jsonOutput,config);
                if(post==200){
                    if(loop>1){
                        page++;
                        for(var i=page; i<loop; i++){
                            var request=await this.fetch(this.urlSet(search,page.toString()),this.requestConfig());
                            status=await request.status;
                            if(status==200){
                                data=await request.json();
                                jsonOutput.items=data.items;
                                post=await this.postRequest(postApi,jsonOutput,config);
                            }
                        }
                    }
                }else error="Post API does not exist or something went wrong";
            }else error="Search results does not exists";
        }
        return error;
    }
    public async requestSearch(search:string,page:string){
        let url=this.urlSet(search,page);
        let request=await this.fetch(url,this.requestConfig());
        return await request.json();
    }
    // using curl 
    /*
    public async curlRequest(){
        let newReq=new CurlImpersonate(this.urlSet("nendoroid",1),this.requestConfig());
        const request=await newReq.makeRequest();
        let json = JSON.parse(request.response);
        let items = json.items;
        console.log(items);
    }
        */
    // send results to target api
    public async postRequest(api:string,json:any,config:any={}){
        var postConfig={
            method:"Post",
            headers:config,
            body:JSON.stringify(json)
        };
        var postRequest=await this.fetch(api,postConfig);
        var status=await postRequest.status;
        return status;
    }
    // calculate loop of requests
    public calculateLoop(results:number){
        var res=1;
        res=results/50;
        var remainder=results%50;
        if(remainder>0&&res>0){
            res=res+1;
        }
        return res;
    }
}