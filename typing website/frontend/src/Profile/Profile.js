import Navbar from '../Home/Navbar';
import React, { useEffect, useState } from 'react'
import { GetCurrentUser } from '../api calls/users'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { GetData } from '../api calls/data';



function Profile(props) {
  const { color } = props;
  const getData = async()=>{
    try {
      const response = await GetData();
      if(response.success){
      console.log(response);
      }
      else{
       message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  useEffect(()=>{
    getData();
  })
  return (
    <div style={{ backgroundColor: color.bgColor, color: color.color, height: "100vh" }}>
      <Navbar></Navbar>
      Profile
      {props.currentUser}
    </div>
  )
}

function ProtectedPage(props) {
  const [currentUser, SetCurrentUser] = useState();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUser();
      if (response.success) {
        message.success(response.message);
        SetCurrentUser(response.data.username);
      }
      else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token"))
      getCurrentUser();
    else
      navigate("/login");
  }, []);

  return (
    currentUser && (
      <>
        <Profile color={props.color} currentUser={currentUser}></Profile>
      </>
    )
  )
}

export { ProtectedPage }