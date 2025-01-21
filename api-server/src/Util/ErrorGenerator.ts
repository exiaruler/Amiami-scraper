export class ErrorGenerator{
    // create json error using keys from json
    public createErrorJson(json:JSON){
        const errorJson:any={
            code:200,
            error:"",
            fields:[

            ]
        }
        var keyArr=Object.keys(json);
        for(var i=0; i<keyArr.length; i++){
            var ele=keyArr[i];
            let item={[ele]:""};
            // add key field to array
            errorJson.fields.push(item);
        }
        return errorJson;
    }
    // add error to field array
    public addErrorField(json:any,key:any,error:string){
        for(var i=0; i<json.fields.length; i++){
            var field=json.fields[i];
            if(field.hasOwnProperty(key)){
                field[key]=error;
                json.fields[i]=field;
                json.code=403;
                break;
            }
        }
        
        return json;
    }
    public setError(json:any,error:string){
        json.error=error;
        json.code=403;
        return json;
    }
    // validate error if exist
    public validateError(json:any){
        let result=false;
        if(json.error!=""){
            result=true;
        }
        for(var i=0; i<json.fields.length; i++){
            var field=json.fields[i];
            for(var x in field){
                if(field[x]!=""){
                    result=true;
                }
            }
        }
        return result
    }
}