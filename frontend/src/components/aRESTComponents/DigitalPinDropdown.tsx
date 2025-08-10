import { Component, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import Form from 'react-bootstrap/Form';
import { aRESTAPI } from "../../api/aREST/aRESTAPI";
import {props} from '../formGenComponents/FieldProps';
interface state{
    options:any
}
// drop down to select digital pins
export class DigitalPinDropdown extends Component<props,state>{
    private api= new aRESTAPI();    
    constructor(props:any) {
        super(props);
        this.state = {
            options:[]
        };
        this.request();
    }
    private async request(){
        try{
            var data=this.api.getDigitalPins();
            this.setState({
                options:data
            });
        }catch(err){

        }
    }
    render(){
        return(
            <Form.Group>
            <Form.Label>{"Digital Pin"}</Form.Label>
            <div className="mb-3">
            <Form.Select id={this.props.name+"Select"} required={this.props.required} onChange={this.props.onChange}  name={this.props.name}>
            {
                this.state.options.map((option: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined)=>(
                    <option>{option}</option>
                ))
            }
            </Form.Select>
            <Form.Control id={this.props.name+"Text"} required={this.props.required} onChange={this.props.onChange}  name={this.props.name} type={this.props.type} defaultValue={this.props.value} size={this.props.size} />
            </div>
            <Form.Text id={this.props.name+"Warning"}>{this.props.warning} </Form.Text>
            </Form.Group>
        );
    }
}