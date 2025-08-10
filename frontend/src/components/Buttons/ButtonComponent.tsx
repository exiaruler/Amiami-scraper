'use client'
import { Component, MouseEventHandler } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
type props={
    id?:any,
    caption:string,
    variant?:string,
    onClick?:MouseEventHandler,
    size:any,
    active?:boolean,
    disabled?:boolean,
    type:any,
}
export class ButtonComponent extends Component<props>{
    render(){
        return(
        <ButtonGroup className="Button-Regular">
        <Button  variant={this.props.variant||"primary"} onClick={this.props.onClick} type={this.props.type} size={this.props.size}>
        {this.props.caption} 
        </Button> 
        </ButtonGroup>  
        );
    }
}