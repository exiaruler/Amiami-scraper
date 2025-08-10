import CryptoJS from 'crypto-js';
// api domain and key
class Base{

  public originUrl=this.defineWindow();
  
  private apiURlBase=process.env.REACT_APP_API_URL||"http://localhost:8000/api";
  // dev key
  private apikey=process.env.REACT_APP_API_KEY||"S7fgxFOTKTK8aCjq";
  // encryption key
  public encryptKey:string=process.env.REACT_APP_API_ENCRYPTKEY||"";
  // js vanilla fetch
   public apiCallConfig(method:string,body=null){
      let date=new Date();
      var config:any={
        method:method,
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
          "apikey":this.getApiKey(),
          "datetime":date,
          "datestring":date.toDateString(),
          "timestring":date.toTimeString()
        },
      };
      if(body!=null){
        config={
          method:method,
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
            "apikey":this.getApiKey(),
            "datetime":date,
            "date":date.toDateString(),
            "time":date.toTimeString()
          },
          body:body
        };
      }
      return config;
    }
    // compatible for next.js and React
    public defineWindow(){
      let origin = '';
      if (typeof window !== 'undefined') {
        origin = window.location.origin;
      }
      return origin;
    }
    public async serviceRequest(service:string,path:string,route:string,method:string,params:any=[],body:any=null){
      var url=this.getApiUrl()+"/service/api-call/"+service+"/"+path+"/"+route;
      var config=this.apiCallConfig(method,body);
      if(params.length>0){

      }
      const request=await fetch(url,config);
      return request;
    }

    public checkEnv(){
      var result=false;
      if(this.apiURlBase==="http://localhost:8000/api"&&this.apikey==="S7fgxFOTKTK8aCjq") result=true;
      return result;
    }
    
    public getApiKey(){
      var key="";
      if(this.apikey!=undefined){
        key=this.apikey;
      }
      return key;
    }
    public getApiUrl(){
      var url="";
      if(this.apiURlBase!=undefined){
        url=this.apiURlBase;
      }
      return url;
    }
  
    public encryptValue(value:string){
      var encryption=value;
      if(this.encryptKey!=undefined&&this.encryptKey!=""){
        encryption=CryptoJS.AES.encrypt(value,this.encryptKey).toString();
      }
      return encryption;
    }
    public decryptValueToString(value:string){
      var convert=value;
      if(this.encryptKey!=undefined&&this.encryptKey!=""){
        const bytes=CryptoJS.AES.decrypt(value,this.encryptKey);
        convert = bytes.toString(CryptoJS.enc.Utf8);
      }
      return convert;
    }
      
}
export default Base;