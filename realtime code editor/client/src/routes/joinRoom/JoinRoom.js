import React, { useState } from 'react'
import {v4 as uuidv4, validate} from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import './JoinRoom.css';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        if(!validate(roomId)){
            toast.error("Incorrect room ID")
            return
        }

        username && navigate(`/room/${roomId}`, {state : {username}});

    }
    const createRoomId= (e)=>{
     try {
        setRoomId(uuidv4());
        toast.success("Room created")
     } catch (exp) {
        console.error(exp);    
     }
    }
  return (
    <div className='joinBoxWrapper'>
    <form className='joinBox' onSubmit={handleFormSubmit}>
      <p>Paste your invitation code down below</p>

      <div className='joinBoxInputWrapper'>
        <input type="text" className='joinBoxInput' id="roomIdInput" placeholder="Enter Room Id"
         value={roomId} onChange={(e)=>setRoomId(e.target.value)}
        />
        <label htmlFor="rootIdInput" className='joinBoxWarning'>
        { roomId ? '' : "Room ID required"}
        </label>
      </div>

      <div className='joinBoxInputWrapper'>
        <input type="text" className='joinBoxInput' id="usernameInput" placeholder="Enter Guest username"
         value={username} onChange={(e)=>setUsername(e.target.value)}
        />
        <label htmlFor="rootIdInput" className='joinBoxWarning'>
        { username ? '' : "Username required"}
        </label>
      </div>

      <button type="submit" className='joinBoxBtn'>Join</button>

      <p>Don't have an invite code?
       Create your <span style={{textDecoration: "underline",
       cursor: "pointer"}} onClick=
       {createRoomId}>own room</span></p>
    </form>
    <Toaster/>
    </div>
  )
}

export default JoinRoom