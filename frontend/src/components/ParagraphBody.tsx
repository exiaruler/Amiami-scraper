'use client'
import { Component } from "react";
export type props={
    value:string
}
export default class ParagraphBody extends Component<props>{
    render(){
        return(
            <div className="paragraph-body">
            <p>{this.props.value}</p>
            </div>
        );
    }
}