'use client'; 
import { Provider, ProviderProps } from 'react-redux';
import store from '../redux/store';

export default function ReduxProvider({children}:any) {
    return <Provider store={store}>{children}</Provider>
}