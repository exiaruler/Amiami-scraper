import { useEffect, useState } from "react";
import PasswordText from "../../../components/PasswordText";
import ProjectAPI from "../../../api/ProjectsAPI";

// development for components
export default function TestBed(){
    const project=new ProjectAPI();
    const [data,setData]=useState([]);
    const getData=async()=>{
        var data=await project.getAllProjects();
        setData(data);
    }
    useEffect(() => {
        getData();
      },[]);
    return(
        <div>
            <PasswordText label={"test"} type={""} name={""} rows={0} required={false} onChange={undefined} warning={""} value={""} size={undefined} api={""}/>
        </div>
    )
}