'use client'
import { Component } from "react";
type Props={
    columnName:string;
    size?:any;
    key:string;
}
export default class TableComponentColumn extends Component<Props>{
    public key=this.props.key;
    public size='';
    constructor(props:Props) {
        super(props);
        this.state = {
            
        };
       
        if(this.props.size){
            this.size=this.props.size;
        }
    }
    componentDidMount(): void {
        
    }
    render(){
        return (
            <th style={{width:this.size}}>
            {this.props.columnName}    
            </th>
        );
    }
}