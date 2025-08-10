'use client'
import { Navigate, useNavigate} from "react-router";
import UiBase from "../base/UiBase";
// guard for user access pages and for login page
const GuardAuthorise=(props:any)=>{
    const base=new UiBase();
    let valid=false;
    const nav=useNavigate();
    const checkAccess=async()=>{
        if(base.util.checkLogCookie()){
            nav("/");
        }else valid=true;
    }
    checkAccess();
    return (valid) 
    ? <props.component/>
    : <Navigate to={`/`} replace={true}/>;
}
export default GuardAuthorise;