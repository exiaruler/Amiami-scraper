'use client'
import { NextUIBase } from '@/NextUIBase';
import { usePathname } from 'next/navigation'
interface Props{
    children:any
}
export default function PageGroup(props:Props){
    const util=new NextUIBase();
    const pathname = usePathname()
    var show=true;
    if(util.checkPageUrl(pathname)){
        show=false;
    }
    return(
        <div>
        {!show?
            props.children
        :null}
        {show?
        <div >
        <h1>Page does not exist</h1>
        </div>
        :null}
        </div>
    )
}