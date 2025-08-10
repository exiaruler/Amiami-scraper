import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
type Props={
    label:string;
    key?:string;
    size:string;
    width?:number;
}
export default function TableColumn(props:any){
    var header=[{name:"hello",size:2},{name:"world",size:2}];
    if(props.columns){
        header=props.columns;
    }
    return(
        <tr>
        {
            header.map((column: { size: number | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; })=>(
                <th colSpan={column.size}>{column.name}</th>
            ))
        }
        </tr>
    );
}