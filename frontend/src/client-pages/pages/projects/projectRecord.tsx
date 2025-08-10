import { useEffect, useState } from "react";
import { ButtonGroup, Col, Container, Nav, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ProjectAPI from "../../api/ProjectsAPI";
import GitHubLogo from "../../assets/github-mark.png";
import BackButton from "../../components/Buttons/BackButton";
import ParagraphBody from "../../components/ParagraphBody";
import Group from "../../components/Group";
export default function ProjectRecord(props:any){
    const {id}=useParams();
    const api=new ProjectAPI();
    const [load,setLoad]=useState(false);
    const [project,setProject]=useState({
        name:"",
        description:"",
        url:""
    });
    const [showLinks,setLinks]=useState(false);
    const getProject=async ()=>{
        if(props.record==null){
            try{
                const project=await api.getProject(id);
                setProject(project);
                setLoad(true);
                displayLinks(project.url);
                api.viewCount(id);
            }catch(err){
                
            } 
        }else{
            setProject(props.record);
            setLoad(true);
            displayLinks(props.record.url);
            api.viewCount(id);
        }
    }
    const displayLinks=(url:string)=>{
        if(url!==""){
            setLinks(true);
        }
    }
    const repositoryHandle=async()=>{
        const request=await api.repositoryCount(id);
    }
    useEffect(() => {
        getProject();
    },[]);
    
    return(
        <div>
        <Group>
        <Row>
        <Col id="BackSection">
        <div className="">
        {load?
        <BackButton url={"/projects"}/>
        :null}
        </div>
        </Col>
        <Col xs={8} md={8}>
        <div className="ProjectTitle">
        <h1>{project.name}</h1>
        </div>
        <ParagraphBody value={project.description}/>
        </Col>
        <Col>
        {showLinks?
        <div id="LinksDiv" className="CentreText">
        <h2>GitHub</h2>
        <a href={project.url} onClick={repositoryHandle}><img src={GitHubLogo} width={30} height={30} alt="GitRepo"/></a>
        </div>
        :null}
        </Col>
        </Row>
        </Group>

        </div>
    );
}