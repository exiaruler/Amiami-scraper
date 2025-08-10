import Util from "./Util";
import UserAPI from "../api/UserAPI";

var util=new Util();
var userApi=new UserAPI();
function onChange(key:any,value:any,setForm:any,form:any){
    setForm({...form,[key]:value});
}
module.exports={
    onChange,
    util,
    userApi
};