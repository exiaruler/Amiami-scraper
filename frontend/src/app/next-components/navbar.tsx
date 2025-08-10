'use client'
import React, { useEffect, useState } from 'react';
import { NextUIBase } from '@/NextUIBase';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { setPages } from '@/redux/slice/pageSlice';
import { useDispatch } from 'react-redux';
import logo from '../assets/samuel logo.png';
//import Logout from '../components/Logout';
  
export default function NavBar(){
    const dispatch = useDispatch();
    const uiBase=new NextUIBase();
    const [login,setLogin]=useState(false);
    //const login=false;
    // dev routes
    //const navigation = new Navigation();
    var protectedRoutes:any=[
        
    ];
    var formsUser:any=[
        
    ];
    var routes=uiBase.getPagesSection('navbar');
    //routes=navigation.routes.filter((route)=>route.show===true);
    //const home=routes[0];
    
    let loginProp=false;
    /*
    if(props.login){
      loginProp=props.login;
    }
      */
    // user links
    //formsUser=navigation.formLinks.filter((link)=>link.show===true);
    //protectedRoutes=navigation.protectedRoutes.filter((link)=>link.show===true);
    const checkLogin=()=>{
      /*
      if(loginProp===true){
        setLogin(true);
      }
        */
    }
    // load pages into redux and session
    const loadPages=async()=>{
      var pages=[];
      var sessionPage=uiBase.util.getPagesSession();
      if(sessionPage.length>0){
        dispatch(setPages(sessionPage));
      }else{
        const request=await fetch(uiBase.util.baseURL+'/api/app/page',{method:'GET'});
        if(request.ok){
          pages=await request.json();
          const decrypt=JSON.parse(uiBase.util.decryptValueToString(pages));
          console.log(decrypt);
          uiBase.util.pageSession(decrypt);
          dispatch(setPages(decrypt));
        }
      }
    }
    const renderUserDrop=()=>{
      return <NavDropdown title="Tools" id="basic-nav-dropdown" >
          {
            // forms
            formsUser.map((link:any)=>(
              <Nav.Link><Link href={link.url}>{link.name}</Link></Nav.Link> 
            ))
          }
          {
            // protected routes
            protectedRoutes.map((link:any)=>(
              <Nav.Link><Link href={link.url}>{link.name}</Link></Nav.Link> 
            ))
          }
         
          </NavDropdown>
    }
    
    useEffect(() => {
      loadPages();
      checkLogin();
      //test();
   },[]);
   
    return (
    <div id="NavBar">
    <nav>
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
                routes.map((route:any,key:number)=>(
                    <Nav.Link><Link href={route.url}>{route.name}</Link></Nav.Link>
                ))
            }
          {login?
            renderUserDrop()
          :null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </nav>
        </div>
    )
}