import { useState } from 'react'
import ishowmeat from '../assets/ishowmeat.jpg'
import { useLocation } from 'react-router-dom';
export default function Error(){
    let unauthorised=false;
    const { state } = useLocation();
    if(state){
        if(state.unauthorised){
            unauthorised=true;
        }
    }
    return(
        <div>
        {!unauthorised?
        <div className="CentreText">
            <h1>404 not found :(</h1>
            <img src={ishowmeat} alt={"ishowspeed"} width={400} height={400}/>
        </div>
        :null}
        {unauthorised?
        <div className="CentreText">
            <h1>Unauthorised access :|</h1>
        </div>
        :null}
        </div>
    )
}