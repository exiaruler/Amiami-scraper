import React from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ParagraphBody from '../components/ParagraphBody';
export default function home(){
  
    return (
        <div className="App">
          <Row>
          <Col id="Col1"></Col>
            <Col id="Col2" md={6}>
            <div className='CentreText'>
            <h1>Welcome to my world!</h1>
            <p>This is my portfolio of my current projects that I am working on and completed projects</p>
            </div>
            
            </Col>
            <Col id="Col3"></Col>
          </Row>
        </div>
      );
}