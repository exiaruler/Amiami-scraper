import { useRouter } from 'next/router';
//import EntryRecord from '../pages/formGen/entryrecord';
export default function RouterGate(props:any){
    const router = useRouter();
    const { id } = router.query;
    return(
        <div>
            
        </div>
    )
}