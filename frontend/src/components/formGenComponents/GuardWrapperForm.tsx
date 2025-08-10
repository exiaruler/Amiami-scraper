'use client'
import { useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import FormGenLibary from "./FormGenLibary";
import { FormAPI } from "../../api/FormAPI";
import Util from "../../base/Util";
import { useLocation } from "react-router-dom";
const GuardWrapperForm=(props:any)=>{
    const { id } = useParams();
    const {formId}=useParams();
    const { state } = useLocation();
    const formGen=new FormGenLibary();
    const api=props.api;
    const config=props.config;
    const util=new Util();
    const formApi=new FormAPI();
    var form:any;
    const recordRef=useRef({});
    const [valid,setValid]=useState(false);
    var data=null;
    const nav=useNavigate();

    const validateFormProm=()=>{
        const inHouseForm=formGen.forms;
        return new Promise<void>(async (resolve,reject)=>{
            var resolution=false;
            // find form in client
            if(formId!==""){
                for(var i=0; i<inHouseForm.length; i++){
                    if(formId===inHouseForm[i].param){
                        form=inHouseForm[i];
                        resolve();
                        resolution=true;
                        break;
                    }
                }
                // send api call for form
                if(!resolution){
                    try {
                        const request=await util.fetchRequest(api+formId);
                        if(request.ok){
                            const response=await request.json();
                            if(response){
                                /*
                                if(id!==""&&id!=="0"){
                                    recordRef.current=getRecord(response.retrieveApi,id);
                                }
                                    */
                                form=response;
                                resolve();
                            }
                        }else reject();
                    } catch (error) {
                        reject();
                    }
                }
            }else{
                reject();
            }
        }).then(
            function(){
                if(id!==""&&id!=="0"&&state==null){
                    apiCall();
                }else if(state!=null&&state.record){
                    //setValid(true);
                    data=state.record;
                }
            },
            function(){
                nav("/error",{ state: { unauthorised:true } });
            }
        );
        
    }
    const getRecord=async (api:any,id:any)=>{
        var data=null;
        try{
            const request=await fetch(api+id,config);
            if(request.ok){
                data=await request.json(); 
                return data 
            }
        }catch(error){
            nav("/error");
        }
    }
    const apiCall=async()=>{
            try {
                const request=await util.fetchRequest(form.retrieveApi+id,"GET");
                if(await request.ok){
                    //const response=await request.json();
                    if(request.ok){
                        setValid(true);
                    }else{
                        nav("/error");
                    }
                }else nav("/error");
            } catch (error) {
                nav("/error");
            }
    }
    validateFormProm();
    if(state!=null&&state.record){
        data=state.record;
    }
    return (id) 
    ? <props.component form={form} record={data} />
    : <Navigate to={`/${formId}/${id}`} replace={true} />;
}
export default GuardWrapperForm;