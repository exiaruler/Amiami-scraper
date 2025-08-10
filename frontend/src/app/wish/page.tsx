'use client'
import { Col, Form, Row } from "react-bootstrap";
import TabComponent from "@/components/Tab/TabComponent";
import TabGroup from "@/components/Tab/TabGroup";
import TableComponent from "../next-components/TableComponent";
import TableComponentColumn from "@/components/Table/TableComponentColumn";
import { ButtonComponent } from "@/components/Buttons/ButtonComponent";
import { ReactNode, useRef } from "react";
import { FormGenText } from "@/components/formGenComponents/FormGenText";
import { SaveButton } from "@/components/Buttons/SaveButton";
import Group from "@/components/Group";
import PageGroup from "../next-components/pageGroup";
export default function page(){
    const tab=useRef<any>(null);
    const wishTable=useRef<any>(null);
    const itemsTable=useRef<any>(null);
    const add=()=>{
        tab.current.handleTabSwitch('addwish');
    }
    const deleteHandle=()=>{
    }
    return (
    <PageGroup>
    <Row>
    <Col md={2} xs={2}>
    </Col>
    <Col md={8} xs={14}>
    <Group>
    <TabGroup ref={tab} defaultActiveKey={"wishlist"}>
    <TabComponent title={"Wish List"} eventKey={"wishlist"}>
    <TableComponent ref={wishTable} results={[]} idKey={"id"}>
    <TableComponentColumn key={"wish"} columnName={"wish"} />   
    </TableComponent>
    <Row>
    <Col className="text-end">
    <ButtonComponent id={""} caption={'Add'} variant={''} onClick={add} size={''} active={false} disabled={false} type={undefined} />
    <ButtonComponent id={""} caption={'Delete'} variant={'danger'} onClick={deleteHandle} size={''} active={false} disabled={false} type={undefined} />
    </Col>
    </Row>
    </TabComponent>
    <TabComponent title={"Wish"} eventKey={"addwish"}>
    <Group >
    <Row>
    <Col>
    </Col>
    <Col>
    <Form >
    <FormGenText type={"text"} rows={0} value={""} label={"Wish"} size={"50%"} required={true}/>
    <Row>
   
    <SaveButton caption={"Save"} size={undefined} type={undefined}/>   
   
    </Row>   
    </Form>
    </Col> 
    </Row>
    </Group>
    <Group>
    <TableComponent ref={itemsTable} results={[]} idKey={"id"}>
    <TableComponentColumn key={"name"} columnName={"Product Name"} />
    <TableComponentColumn key={"price"} columnName={"Price"} />
    <TableComponentColumn key={"manufacturer"} columnName={"Manufacturer"} />
    <TableComponentColumn key={"lastseendate"} columnName={"Last Seen Date"} />
    <TableComponentColumn key={"lastseentime"} columnName={"Last Seen Time"} />              
    </TableComponent>  
    </Group>
    </TabComponent>
    </TabGroup>
    </Group>
    </Col>
    <Col >
    </Col>
    </Row>
    </PageGroup>
    );
}