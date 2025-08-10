import Util from "./Util";
import UserAPI from "../api/UserAPI";
import { CommonAPI } from "../api/CommonAPI";
import { getPages } from "../redux/slice/pageSlice";
import { useSelector,useDispatch} from 'react-redux';
import {page} from './interfaces/page';
// base class for UI pages
export default class UiBase {
    // common util tools
    public util=new Util();
  
    // user api calls
    public userApi=new UserAPI();
    public commonApi=new CommonAPI();
    public pages:Array<page>=useSelector(getPages);
    public UiBase(){
        
    }
    // get pages by section
    public getPagesSection(section:string){
        return this.pages.filter((pa:page)=>pa.section===section&&pa.show===true);
    }
    // get page by url
    public getPageUrl(url:string){
        return this.pages.find((pa:page)=>pa.url===url&&pa.show===true);
    }
    public checkPageUrl(url:any){
        var res=false;
        var exist=this.pages.find((pa:page)=>pa.url===url&&pa.show===true);
        if(exist!==undefined) res=true;
        return res;
    }
    public createUrl(page:page){
        let url=page.url;
        if(page.loadParam!=""){
            url+=page.loadParam;
        }
        return url;
    }
    public pageSession(pages:Array<page>){
        this.util.pageSession(pages);
    }
    public getPagesSession(){
        return this.util.getPagesSession();
    }
    // form on change handler
    public onChange(key:any,value:any,setForm:any,form:any){
        setForm({...form,[key]:value});
    }
}