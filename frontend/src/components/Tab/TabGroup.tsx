'use client'
import React from "react";
import { forwardRef, ReactElement, ReactNode, useImperativeHandle, useState } from "react";
import { Tabs } from "react-bootstrap";
import TabProps from './TabProps';
type Props={
    id?:string;
    defaultActiveKey:any;
    children?:React.ReactElement<TabProps,any>[];
    others?:any;
}
 const TabGroup=forwardRef(function TabGroup(props:Props,ref){
    const [activeTab, setActiveTab] = useState(props.defaultActiveKey);

    const handleTabSwitch = (tabKey:any) => {
        setActiveTab(tabKey);
      };
    
    useImperativeHandle(ref,()=>{
        return {
            handleTabSwitch
        }
    },[]);
  
    return (
        <div>
        <Tabs
        className="mb-4"
        activeKey={activeTab}
        onSelect={(tabKey:any) => setActiveTab(tabKey)}
        defaultActiveKey={props.defaultActiveKey}
        >
        {
            props.children
        }
        </Tabs>
        </div>
    );
});
export default TabGroup;