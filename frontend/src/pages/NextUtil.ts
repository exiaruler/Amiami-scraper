import { NextBase } from "@/NextBase";

export class NextUtil extends NextBase{
    
    private jsonTransform(data:any){
        return { ...data, source: 'proxied-through-nextjs' };
    }
    public returnResponse(data:any){
        const transformedData=this.jsonTransform(data);
        return new Response(JSON.stringify(transformedData),
    {
        headers: { 'Content-Type': 'application/json' }
    });
    }
}