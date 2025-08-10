import { configureStore } from '@reduxjs/toolkit'
import { loginSlice } from './slice/loginSlice';
import { pageSlice } from './slice/pageSlice';
export default configureStore({
    reducer:{
        login:loginSlice.reducer,
        page:pageSlice.reducer
    }
});