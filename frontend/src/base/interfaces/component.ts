export interface Component{
    value: string
    field:Field
    component:any
    name:string
    error:any
};
export interface Field{
    label:string
    type:string
    name:string
    rows:number
    required:boolean
}