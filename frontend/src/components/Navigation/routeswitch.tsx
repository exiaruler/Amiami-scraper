import {  Routes, Route } from "react-router-dom";
import navigation from "./navigation";
import GuardWrapper from "../GuardWrapper";
import GuardWrapperForm from "../formGenComponents/GuardWrapperForm";
import GuardAuthorise from "../GuardAuthorise";
import { page } from "../../base/interfaces/page";
import UiBase from "../../base/UiBase";
import React from "react";
type Props={
    pages?:Array<Object>;
}
export default function routesswitch(props:Props){
    var nav=new navigation();
    const base=new UiBase();
    const pages=base.pages;
    // home
    const home={element:nav.routes[0].component};
    
    const routePage=(pa:page)=>{
        let path:string=pa.path;
        let guard:any=nav.findGuard(pa.guard);
        let page:any=nav.findPage(pa.path);
        let route=<Route element={React.createElement(page)} index={pa.index} path={path}/>;
        if(page!=null){
            if(guard!=null){
                route= <Route element={
                React.createElement(guard,{api:pa.api,auth:pa.protected,component:page},React.createElement(page))            
                } 
                path={path}
                index={pa.index}
                />
            }
            return route;
        }
    }
    return(
        <div>
            <Routes>
                {
                
                    pages.map((pa:page,key)=>(
                        routePage(pa)
                    ))
                        
                    
                }
                {
                    //<Route index={true} element={<home.element/>}/>
                }
            </Routes>
        </div>
    );
}