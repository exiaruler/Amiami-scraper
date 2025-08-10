'use client'
import { type } from "os";
import { ChangeEventHandler, Component, useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
type Props={
    label?:string,
    type:string,
    name?:string,
    required?:boolean,
    onChange?:ChangeEventHandler
    warning?:string,
    value:any,
    size:any,
}
export class FormGenCheckBox extends Component<Props>{
    private componentId=this.props.name+"Check";
    constructor(props:Props) {
        super(props);
        this.state = {
            
        };
    }
   
    render(){
        return(
            <Col md="3">
            <div className="mb-3">
            <Form.Group>
            <Form.Check id={this.componentId} required={this.props.required} reverse={true} label={this.props.label} defaultChecked={this.props.value} onChange={this.props.onChange} name={this.props.name} />
            <Form.Text id={this.props.name+"Warning"}>{this.props.warning} </Form.Text>
            </Form.Group>
            </div>
            </Col>
        );
    }
}