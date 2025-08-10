export default function Group(props:any){
    return(
        <div style={{padding:'4px',border:'1px solid #E0E0E0',margin:'4px'}}>
        {
            props.children
        }
        </div>
    );
}