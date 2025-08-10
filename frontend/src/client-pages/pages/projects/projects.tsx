import React, { useEffect } from 'react';
import { useState } from 'react';
import { Col, Container, ListGroup, ListGroupItem, Row, Spinner} from 'react-bootstrap';
import {Project} from '../../base/interfaces/project';
import ProjectAPI from '../../api/ProjectsAPI';
import ProjectCard from '../../components/projects/ProjectCard';
import { useLocation, useNavigate } from 'react-router';
import { useSelector} from 'react-redux';
import {getLoginState} from "../../redux/slice/loginSlice";
import UiBase from '../../base/UiBase';
import Group from '../../components/Group';
// route links
export default function Projects(){
  const api=new ProjectAPI();
  const base=new UiBase();
  const { state } = useLocation();
  var login=useSelector(getLoginState);
  //login=base.util.checkLogCookie();
  const [projects,setProject]=useState<Project[]>([]);
  const [loading,setloading]=useState(true);
  const getProjects=async()=>{
    try{
      const projectReq= await api.getAllProjects();
      if(projectReq.length>0){
        setloading(false);
        setProject(projectReq);
      }else{
        setloading(false);
        const empty=[{_id:0,name:"No projects available",description:"",url:"",views:0,repositoryClicks:0}];
        setProject(empty);
      }
    }catch(err){
      if(err){
      setloading(false);
      const empty=[{_id:0,name:"No projects available",description:"",url:"",views:0,repositoryClicks:0}];
      setProject(empty);
      }
    }
   
  }
  useEffect(() => {
    getProjects();
  },[]);
  
    return(
      <div>
      <Group>
      <Row>
      <Col>
      </Col>
      <Col xs={12} md={6} >
      <div className=''>
        <p hidden={true} >Here a list of projects which I have worked on in my spare time. Some will have links to GitHub Repository links other not because of it sensitive nature.</p>
      </div>
      <ListGroup variant="flush">
      {loading ?
      <div className='CentreText'>
      <Spinner animation="border" variant="primary" />
      </div>
      :null}
      {
        projects.map((project,key)=>(
        <ListGroup.Item>
        <ProjectCard repositoryClicks={project.repositoryClicks} views={project.views} name={project.name} description={project.description} url={project.url} key={project._id} id={project._id} project={project} login={login}/>
        </ListGroup.Item>
        ))
      }
      </ListGroup>
      </Col>
        <Col></Col>
      </Row>
      </Group>
    
        </div>
    );
  
  
}