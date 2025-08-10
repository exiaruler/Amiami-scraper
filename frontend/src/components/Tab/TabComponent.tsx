'use client'
import { Tab } from "react-bootstrap";
import TabProps from './TabProps';
/*
export default function TabComponent(props:TabProps){
    
    return(
        <Tab title={props.title} eventKey={props.eventKey}>
            {
                props.childen
            }
        </Tab>
    )
}
    */
const TabComponent: React.FC<TabProps> = ({eventKey,title,childen}) => {
    return (
      <Tab eventKey={eventKey} title={title}>
        {childen}
      </Tab>
    );
  };
  export default TabComponent;