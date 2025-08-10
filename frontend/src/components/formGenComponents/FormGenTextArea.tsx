import { Form } from "react-bootstrap";
import { FormGenText } from "./FormGenText";

export class FormGenTextArea extends FormGenText{
    private rows=this.props.rows;
    render(){
        return(
            <Form.Group>
            <Form.Label>{this.props.label}</Form.Label>
            <Form.Control spellCheck={true} id={this.props.name+"Text"} required={this.props.required} name={this.props.name} as="textarea" rows={this.rows} defaultValue={this.props.value}/>
            <Form.Text id={this.props.name+"Warning"}></Form.Text>
            </Form.Group>
        );
    }
}