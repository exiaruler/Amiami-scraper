import { ErrorGenerator } from "./ErrorGenerator";
import fetch from "node-fetch";
export class UtilTool{
    public error=new ErrorGenerator();

    public fetch = require('node-fetch');
    // Create page listing per page 10 records per page
    public createPageList(itemsArr:any,page:number){
        page=page-1;
        var start =(page*10)-1;
        if(start==-1||start<-1){
            start=0;
        }
        var items=itemsArr.reverse();
        var output=[];
        var max=start+10;
        output=itemsArr.slice(start,max);
        var pageLim=items.length/10;
        if(items.length<10){
            pageLim=1;
        }
        var checkDec=pageLim%1;
        if(checkDec!=0){
            pageLim=this.calculateLimit(pageLim);
        }
        var result={
            "total":items.length,
            "limit":pageLim,
            "output":output
            };
        return result;
    }
    public createPageListNums(itemsArr:any,page:number,size:number){
        if(size<=5){
            size=10;
        }
        page=page-1;
        var start =(page*size)-1;
        if(start==-1||start<-1){
            start=0;
        }
        var items=itemsArr.reverse();
        var output=[];
        var max=start+10;
        output=itemsArr.slice(start,max);
        /*
        for(var i=start; i<items.length; i++){
            if(output.length==10){
                break;
            }
            output.push(items[i]);
        }
        */
        var pageLim=items.length/10;
        if(items.length<10){
            pageLim=1;
        }
        var checkDec=pageLim%1;
        if(checkDec!=0){
            pageLim=this.calculateLimit(pageLim);
        }
        var result={
            "total":items.length,
            "size":size,
            "limit":pageLim,
            "output":output
            };
        return result;
    }
    private calculateLimit(page: number): number {
        var sum=1;
        var num=1;
        var cal=false;
        while(!cal){
            sum=num-page;
            if(1>sum&&sum>=0.1){
                break;
            }
            num++;
        }
        return num;
    }
    public getDate(){
        const date=new Date();
        const currentDate=  date.getMonth()+ "/" + (date.getDate()) + "/" + date.getFullYear();
        return currentDate;
    }
    public calculateHours(time:number){
        return time * 60 * 60 * 1000;
    }
    public delay(ms:number){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}