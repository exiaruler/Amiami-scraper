import { Button, Col, Form, Row } from "react-bootstrap";
import { FormGenText } from "./formGenComponents/FormGenText";
import { Component } from "react";
import {props} from './formGenComponents/FieldProps'
type state={
    type:any,
    hide:boolean
}
export default class PasswordText extends Component<props,state>{
    constructor(props:any) {
        super(props);
        this.state = {
            type:"password",
            hide:true
        };
    }
    private unhidePassword(){
        if(this.state.hide){
            this.setState({
                type:"text",
                hide:false
            });
        }else{
            this.setState({
                type:"password",
                hide:true
            });
        }
    }
    render(){
        return(
            <Row>
            <Col>
            <Form.Group>
            <Form.Label>{this.props.label}</Form.Label>
            <div className="mb-3">
            <Form.Control id={this.props.name+"Text"} required={this.props.required} onChange={this.props.onChange}  name={this.props.name} type={this.state.type} defaultValue={this.props.value} size={this.props.size} />
            </div>
            <Form.Text id={this.props.name+"Warning"}>{this.props.warning} </Form.Text>
            </Form.Group>
            </Col>
            <Col>
            <Button onClick={this.unhidePassword}>Unhide Password</Button>
            </Col>
            </Row>
        );
    }
}