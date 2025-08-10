import { useParams } from "react-router";
import FormGenLibary from "../../components/formGenComponents/FormGenLibary";
import { Alert, Button, Col, Form, ProgressBar, Row, Spinner } from "react-bootstrap";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { Component } from "../../base/interfaces/component";
import BackButton from '../../components/Buttons/BackButton';
import { SaveButton } from "../../components/Buttons/SaveButton";
import { ButtonComponent } from "../../components/Buttons/ButtonComponent";
import { FormAPI } from "../../api/FormAPI";
import UiBase from "../../base/UiBase";
import Group from "../../components/Group";
interface Props{
  form?:any;
  record?:any;
  entry?:Boolean;
  clearHandle?:CallableFunction;
  submitHandle?:CallableFunction;
  clearAction?:Boolean;
  id:string;
  formId:string;
  valueKey:string;
  onClick?:CallableFunction;
}
const form=forwardRef (function FormPage(props:Props,ref){
  const { state } = useLocation();
  let formJson;
  let location = useLocation();
  const [formLay,setFormLay]=useState({
    urlLocation:"",
    formName:"",
    postapi:"",
    updateapi:"",
    deleteapi:"",
    headers:"",
    redirect:"",
    retrieveApi:"",
    settingOverride:false,
    form:null
  });
  const currentForm=location.pathname;
  // form used in entry record page
  let entryUsed=false;
  // used for settings
  const [recordSetId,setRecordSetId]=useState("");
  let stateModel:any=useRef({});
  let errorClearRef:any=useRef([]);
  const api=new FormAPI();
  const [formError,setFormError]=useState<any>({});
  const {formId}=useParams();
  let {id}=useParams();
  let record:any=useRef({});
  let formUpdate=useRef(false);
  const [formArr,setFormArr]=useState<Component[]>([]);
  const [load,setLoad]=useState(true);
  const [loadSate,setLoadState]=useState(0);
  const [error,setError]=useState(true);
  const [formErrorMsg,setFormErrorMsg]=useState<any>({
    hide:true,
    error:""
  });
  let keyArr:any=useRef([]);
  const nav=useNavigate();
  const base=new UiBase();
  const formLib= new FormGenLibary();
  
  const createApiUrl=(api:string)=>{
    let url="";
    if(api!=""&&api!=undefined){
      url=base.util.getApiUrl()+api;
    }
    return url;
  }
  // set prop from the guardwrapper if possible
  const setFormProp=()=>{
    errorClearRef.current=[];
    if(props.form){
      formJson=props.form;
      setLoadState(10);
      if(formJson){
        setFormLay({
          urlLocation:location.pathname,
          formName:formJson.name,
          postapi:base.util.getApiUrl()+formJson.postApi,
          updateapi:base.util.getApiUrl()+formJson.updateApi,
          deleteapi:createApiUrl(formJson.deleteApi),
          headers:formJson.headers,
          redirect:formJson.redirect,
          retrieveApi:base.util.getApiUrl()+formJson.retrieveApi,
          settingOverride:formJson.setting,
          form:formJson.form
        });
        renderForm(formJson);
      }
    }else findForm();
    
  }


  const findForm=async ()=>{
    // find form inhouse first before api call
    if(props.form){
      setLoadState(10);
      renderForm(props.form);
    }
    else{
      let form=formLib.findInhouseForm(formId);
    if(form!=null){
      setLoadState(10);
      renderForm(form);
    }else{
      try {
        const request=await fetch(base.util.getApiUrl()+"/form/get-form/"+formId,base.util.apiCallConfig("GET"));
        const response=await request.json();
        if(id!=="0"){
          if(props.record===null){
            const recordRequest=await api.getRecord(base.util.getApiUrl()+response.retrieveApi,id);
            record.current=recordRequest;
          }else if(props.record!=null) record.current=props.record;
        }
        if(response.setting){
          const recordRequest=await api.getRecordSingle(base.util.getApiUrl()+response.retrieveApi);
          record.current=recordRequest;
          setRecordSetId(record.current._id);
        }
        renderForm(response);
      } catch (error) {
        
      }
    }
    }
    
  }
  const renderForm=(formObj:any)=>{
    const renderModel=new Promise<void>((resolve,reject)=>{
      if(formObj.stateModel){
        setFormLay({
          urlLocation:location.pathname,
          formName:formObj.name,
          postapi:base.util.getApiUrl()+formObj.postApi,
          updateapi:base.util.getApiUrl()+formObj.updateApi,
          deleteapi:createApiUrl(formObj.deleteApi),
          headers:formObj.headers,
          redirect:formObj.redirect,
          retrieveApi:base.util.getApiUrl()+formObj.retrieveApi,
          settingOverride:formObj.setting,
          form:formObj.form
        });
        stateModel.current=originalFormSet(formObj.stateModel);
        resolve();
      }else{
        reject();
      }
    });
    renderModel.then(
      function(){
        let errorJson={};
        for( let i=0; i<formObj.stateModel.length; i++){
          let key=formObj.stateModel[i].key;
          keyArr.current.push(key);
          errorJson=Object.assign({}, errorJson, { [key]: '' });
        }
        setFormError(errorJson);
        setLoadState(50);
        renderFormFields(formObj.form,keyArr.current,formObj.setting);
      },
      // display error message
      function(){
        setError(false);
        setLoad(false);
      }
    );
  }
  const originalFormSet=(stateModel:Array<any>)=>{
    let clear:any={};
    for(let i=0; i<stateModel.length; i++){
      let part=stateModel[i];
      let key=part.key;
      let error:any={};
      error[key]='';
      errorClearRef.current.push(error);
      clear[part.key]=part.value;
    }
    return clear;
  }
  const clearForm=(update:boolean=false)=>{
    id="0";
    formUpdate.current=false;
    record.current={};
    insertValuesEntry(stateModel.current);
    setFormErrorMsg({
        hide:true,
        error:""
    });
    if(!entryUsed)nav("/form/"+formId+"/0",{ state:{ login:true} });
    writeError(errorClearRef.current);
    if(props.entry&&props.clearHandle){
      props.clearHandle(update);
    }
  }
  const clearError=()=>{
    writeError(errorClearRef.current);
  }
  const deleteRecord=async()=>{
    if(id!="0"){
      try{
        const request=await fetch(formLay.deleteapi+id,{
          method:'DELETE',
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
            apikey:formLay.headers
          }
        });
        if(await request.ok){
          clearForm(true);
        }
      }catch(err){
        base.util.unauthorisedAccess();
      }
    }
  }
  const renderFormFields=(fieldArr:any,keyArr:any,settingOverride:boolean)=>{
    let fields: any[]=[];
    const renderFields=new Promise<void>((resolve,reject)=>{
      const fieldsTotal=fieldArr.length;
      let count=0;
      let loadAdd=50/fieldsTotal;
      for(let i=0; i<fieldArr.length; i++){
        let field=fieldArr[i];
        let comp=formLib.findComponent(field.component);
        if(comp==null){
          reject();
          break;
        }
        let formErr=formError[keyArr[count]];
        let setValue=stateModel.current[keyArr[count]];
        if(id!="0"||settingOverride){
          setValue=record.current[keyArr[count]];
        }
        let compAtt={
          // field props for component
          field:field,
          // warning state
          error:formErr,
          // component from library
          component:comp,
          // name
          name:keyArr[count],
          //value
          value:setValue
        };
        fields.push(compAtt);
        setLoadState(loadSate+loadAdd);
        count++;
      }
      if(fieldsTotal===count){
        setFormArr(fields);
        resolve();
      }else reject();
    });
    renderFields.then(
      function(){
        //loadData();
        setLoad(false);
        let btn=document.getElementById('SubmitBtn') as HTMLElement;
        btn.hidden=false;
      },
      function(){
        setError(false);
        setLoad(false);
      }
    )
  }

  const insertValuesEntry=(entry:any)=>{
    let form=document.getElementById('FormField') as HTMLFormElement;
    let elementArr=form.elements;
    for(let i=0; i<elementArr.length; i++){
      let field=elementArr[i] as HTMLFormElement;
      let key=field.name;
      let value=entry[key];
      if(field.type!="submit"){
        if(field.type==="checkbox"){
          field.checked=value;
        }else{
          field.value=value;
        }
      }
    }
  }
  const getValuesFromFields=()=>{
    let form=document.getElementById('FormField') as HTMLFormElement;
    let inputArr=[];
    let elementArr=form.elements;
    for(let i=0; i<elementArr.length; i++){
      let field=elementArr[i] as HTMLFormElement;
      if(field.type!="submit"&&field.type!="button"){
        let value;
        let key=field.name;
        if(field.type==="checkbox"){
          value=field.checked;
        }else{
          value=field.value;
        }
        let input={[key]:value};
        record.current[key]=value;
        inputArr.push(input);
      }
    }
    return inputArr;
  }
  const createDataJson=(array:any)=>{
    const jsonObject = Object.assign({}, ...array);
    return jsonObject
  }
  const writeError=async(errorArr:any)=>{
    for(let i=0; i<errorArr.length; i++){
      let value=errorArr[i];
      let key=Object.keys(value)[0];
      if(key!==""){
        let error:any=value[key];
        setFormError({...formError,[key]:error});
        let errorEle=document.getElementById(key+'Warning') as HTMLElement;
        errorEle.innerHTML=error;
      }
    }
  }
  const submitForm=async (event:any)=>{
    // get values from input and turn into json for data
    event.preventDefault();
    const arr=getValuesFromFields();
    const json=createDataJson(arr);
    // update forms that are setting enabled
    if(formLay.settingOverride){
      try{
        const request=await fetch(formLay.updateapi+recordSetId,{
          method:'PUT',
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
            apikey:formLay.headers
          },
          body:JSON.stringify(json)
        });
        submissionDirect(request);
      }catch(err){
        base.util.unauthorisedAccess();
      }
    // non setting enbale process
    }else if(id!=="0"){
      try{
        const request=await fetch(formLay.updateapi+id,{
          method:'PUT',
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
            apikey:formLay.headers
          },
          body:JSON.stringify(json)
        });
        submissionDirect(request);
      }catch(err){
        base.util.unauthorisedAccess();
      }
    }else
    // submit new record
    {
      try{
        const request=await fetch(formLay.postapi,
          {
            method:'POST',
            credentials: 'include',
            headers:{
              'Content-Type': 'application/json',
              apikey:formLay.headers
            },
            body:JSON.stringify(json)
          });
          submissionDirect(request);
      }catch(err){
        base.util.unauthorisedAccess();
      }
    }
  }

  const submissionDirect=async (request:any)=>{
    if(request.ok){
      id="0";
      if(entryUsed)clearForm(true);
      if(!entryUsed){
        nav(formLay.redirect,{ state:{ login:true} });
      }else if(props.submitHandle) {
        props.submitHandle();
      }
      writeError(errorClearRef.current);
      setFormErrorMsg({
        hide:true,
        error:""
      });
    }else
    {
      if(entryUsed)formUpdate.current=true;
      const response=await request.json();
      writeError(response.fields);
      if(response.error!==""){
        setFormErrorMsg({
          hide:false,
          error:response.error
        });
      }else{
        setFormErrorMsg({
          hide:true,
          error:response.error
        });
      }
    }
  }
  const changeForm=()=>{
    let result=false;
    if(formLay.urlLocation!=currentForm&&formLay.urlLocation!=""){
      result=true;
    }
    return result;
  }
  
  
  useImperativeHandle(ref,()=>{
    return {
      clearForm,
      clearError
    }
  },[]);
  if(changeForm()){
    const form:any=document.getElementById('FormRender') as HTMLElement;
    //form.innerHTML=""
    setFormProp();
  }
  if(props.entry){
    entryUsed=true;
    if(props.record&&props.record!=null&&!props.clearAction){
      id=props.id;
      if(!formUpdate.current||id!=record.current[props.valueKey])record.current=props.record;
      insertValuesEntry(record.current);
    }else id="0";
  }
  
  useEffect(() => {
     setFormProp();
  },[]);
  return(
    <div>
    <Group>
    <Row>
    <Col >
    {!load?
    <BackButton url={-1} onClick={props.onClick}/>
    :null}
    </Col>
    <Col md={8} xs={12}>
    <div id="FormDiv">
    <div className="CentreText">
    {!entryUsed?
    <h1>{formLay.formName}</h1>
    :null}
    </div>
    <Group>
    <Form id={"FormField"} onSubmit={submitForm} >
    {load ?
      <div className='CentreText'>
      <ProgressBar now={loadSate} />
      </div>
      :null}
    <div id="FormRender">
    {
      // writes form fields
      formArr.map(form=>(
        React.createElement(form.component,
          {label:form.field.label,type:form.field.type,name:form.name,required:form.field.required,rows:form.field.rows,warning:form.error,value:form.value})
      ))
    }
    </div>
    <div id="ErrorDiv" hidden={error}>
    <h2>Something went wrong please try again</h2> 
    </div>
    <Alert variant='warning' key='warning' hidden={formErrorMsg.hide}>
    {formErrorMsg.error}
    </Alert>
    {!formLay.settingOverride?
    <Button id="ClearBtn" variant="primary" size="lg" onClick={()=>clearForm(false)} >Clear</Button>
    :null}
    {formLay.deleteapi!==""? 
    <Button id="DeleteBtn" variant={'danger'} onClick={deleteRecord} size="lg" >Delete</Button>
    :null}
    <Button id="SubmitBtn" variant="primary" size="lg" hidden={true} type="submit">Save</Button>
    </Form>
    </Group>
    </div>
    </Col>
    <Col>
    </Col>
    </Row>
    </Group>
    </div>);
});
export default form;
