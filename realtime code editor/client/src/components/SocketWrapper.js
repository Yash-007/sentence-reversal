import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {io} from 'socket.io-client';
import { toast } from "react-hot-toast";

function SocketWrapper({children}) {
 const socket= io.connect("http://localhost:5000");

 const location = useLocation();
 const {roomId} = useParams();
 const navigate = useNavigate();

 const addPropsToReactElement=(element,props)=>{
   if(React.isValidElement(element)){
    return React.cloneElement(element,props);
   }

   return element;
 }

 const addPropsToChildren=(children, props)=>{
     if(!Array.isArray(children)){
        return addPropsToReactElement(children,props);
     }

     return children.map(childElement => addPropsToReactElement(childElement,props));
 }

 useEffect(()=>{
    const kickStrangerOut=()=>{
        navigate("/", {replace: true});
        toast.error("No username provided");
    }

   location.state?.username ? socket.emit("when a user joins", {roomId, username: location.state.username}) :
    kickStrangerOut();
 },[location.state, socket, roomId, navigate]);



  return location.state?.username ? <div>{addPropsToChildren(children,{socket})} </div> : (
    <div className="room">
    <h2>No username provided. Please use the form to join a room.</h2>
    </div>
  )
}

export default SocketWrapper