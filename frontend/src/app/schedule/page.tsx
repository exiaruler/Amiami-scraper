import { Col, Row } from "react-bootstrap";
import TableComponent from "../next-components/TableComponent";
import TableComponentColumn from "@/components/Table/TableComponentColumn";


export default function page(){
    return(
        <div>
        <Row>
        <Col md={2}></Col>
        <Col md={9}>
        <TableComponent results={[]} idKey={"id"}>
        <TableComponentColumn key={"name"} columnName={"Name"}/>
        <TableComponentColumn key={"time"} columnName={"Schedule Time"}/>
        </TableComponent>
        </Col>
        <Col md={4}></Col>
        </Row>
        </div>
    );
}