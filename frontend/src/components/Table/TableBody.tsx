import { forwardRef, useImperativeHandle, useRef, useState } from "react";
//import checked from "../../assets/checked.png";
import checked from "../assets/checked.png";

const TableBody=forwardRef(function TableBody(props:any,ref){
    var keys=props.keys;
    const bodyRef:any=useRef();
    let records:Array<JSON>=[];
    var idKey=props.idKey;
    let [selectedRow, setSelectedRow] = useState(-1);
    records=props.records;
    
    const print=(json:any,key:any,indexKey:number)=>{
        let size=0;
        let name=key.key;
        size=key.size;
        let value=json[name];
        let id=json[idKey];
        let element=<td key={id} colSpan={size} style={{
            backgroundColor: selectedRow === indexKey ? "#D3D3D3" : ""
          }} className={selectedRow === indexKey ? "TableRowSelect":""}>{value}</td>;
        if(valueBoolean(value)){
            element=<td key={id} colSpan={size} style={{
                backgroundColor: selectedRow === indexKey ? "#D3D3D3" : ""
              }} className={selectedRow === indexKey ? "TableRowSelect":""}>
            <img src={checked} alt="Checked" width={"30xpx"} height={"30px"}/>
              </td>;
        }
        return element;
    }
    const valueBoolean=(value:any)=>{
        return value === false || value === true;
    }
    const selectRow=(rec:any,key:number)=>{
        setSelectedRow(key);
        if(props.onClick){
            props.onClick(rec);
        }
    }
    const doubleClick=()=>{
        if(props.onDoubleClick){
            props.onDoubleClick();
        }
    }
    useImperativeHandle(ref,()=>{
        return {
            selectRow,
        }
      },[]);
    
    return(
    <tbody ref={bodyRef}>
    {
        records.map((record:any,index:number)=>(
            <tr  onClick={()=>selectRow(record,index)} onDoubleClick={doubleClick}
            >
            {
                keys.map((key:JSON)=>(
                print(record,key,index)
                ))
            }
            </tr>
        ))
    }
    </tbody>
    );
});
export default TableBody;
