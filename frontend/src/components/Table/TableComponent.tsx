'use client'
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import Table from 'react-bootstrap/Table';
import checked from "../assets/checked.png";
import { Image } from "react-bootstrap";
type Props={
    id?:string;
    width?:any,
    rowSelect?:boolean;
    children?:Array<ReactNode>;
    results:Array<Object>;
    others?:any;
    idKey:string;
    onClick?:CallableFunction;
    onDoubleClick?:CallableFunction;
}

const TableComponent=forwardRef(function TableComponent(props:Props,ref){
    var rowSelect=false||props.rowSelect;
    var width='';
    var idKey='';
    const [selectedRow, setSelectedRow] = useState(-1);
    const [selectRowRec,setSelectedRowRec]=useState(null);

    const valueBoolean=(value:any)=>{
        return value === false || value === true;
    }
    const print=(json:any,key:string,indexKey:number,size?:any)=>{
        let value=json[key];
        let id=json[idKey];
        let element=<td key={id}  style={{
            //width:size,
            backgroundColor: selectedRow === indexKey ? "#D3D3D3" : ""
          }} className={ selectedRow === indexKey ? "TableRowSelect":""}>{value}</td>;
        if(valueBoolean(value)){
            element=<td key={id}  style={{
                //width:size,
                backgroundColor: selectedRow === indexKey ? "#D3D3D3" : ""
              }} className={selectedRow === indexKey ? "TableRowSelect":""}>
            <Image src={checked} alt="Checked" width={"30xpx"} height={"30px"}/>
              </td>;
        }
        return element;
        
    }
    const selectRow=(rec:any,key:number)=>{
        if(rowSelect){
            setSelectedRow(key);
            setSelectedRowRec(rec);
            if(props.onClick){
                props.onClick(rec);
            }
        }
    }
    const returnRow=()=>{
        return selectRowRec;
    }
    const returnRowIndex=()=>{
        return selectedRow;
    }
    const doubleClick=()=>{
        if(rowSelect){
            if(props.onDoubleClick){
                props.onDoubleClick();
            }
        }
    }
    useImperativeHandle(ref,()=>{
            return {
                selectRow,
                returnRow,
                returnRowIndex
            }
    },[]);
    return (
        <Table hover={rowSelect} bordered  {...props.others} width={width} responsive={"md"} size={"sm"} id={props.id} >
        <thead>
        <tr>
        {
            props.children
        }
        </tr>
        </thead>
        <tbody>
        {
            props.results.map((rec:Object,index)=>(
                <tr onClick={()=>selectRow(rec,index)} onDoubleClick={doubleClick}>
                {
                    props.children?.map((ele:any)=>(
                        print(rec,ele.key,index,ele.props.size)
                    ))
                }
                </tr>
            ))
        }
        {
        props.results.length==0?
            <tr>
                <td colSpan={props.children?.length} style={{textAlign:'center'}}>No results avaliable</td>
            </tr>
        :null
        }
        </tbody>
        </Table>
        );
});

export default TableComponent;