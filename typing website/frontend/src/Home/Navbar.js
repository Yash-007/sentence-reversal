import React, { useEffect, useState } from 'react'
import {NavLink} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSolid} from '@fortawesome/free-solid-svg-icons';
import './Home.css';


function Navbar() {
  return (
    <>
    <div className='header'>
    <span className='title'><h1>TypeNow</h1></span>

    <div className='navbar'>
       <NavLink to="/" className='item home-box'>Home</NavLink>
       <NavLink to= "/login" className='item'>About</NavLink>
       <NavLink to="/settings" className='item'>Settings</NavLink>
       <NavLink to= "/profile" className='item icon-box'><FontAwesomeIcon icon={faUser}/></NavLink>
       
    </div>
    </div>
    </>
  )
}

export default Navbar