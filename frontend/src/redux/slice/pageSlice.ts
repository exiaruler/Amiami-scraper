import { createSlice } from "@reduxjs/toolkit";
export const pageSlice=createSlice({
    name: "page",
    initialState:{
        pages:[],
        pageTotal:0
    },
    reducers:{
        setPages:(state,action)=>{
            state.pages=action.payload;
            state.pageTotal=action.payload.length;
        }
    }
})
export const{setPages}=pageSlice.actions;

export const getPages=(state:any)=>state.page.pages;
export const getPageSection=(state:any,action:any)=>{
    let section=action.payload;
    return state.page.pages.find((pa:any)=>pa.section===section);
}
export default pageSlice.reducer;