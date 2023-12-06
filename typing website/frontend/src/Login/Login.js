import React, { useEffect, useRef, useState } from 'react'
import './Login.css';
import Home from '../Home/Home';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../api calls/users';
import { message} from 'antd';
import Navbar from '../Home/Navbar';
function Login() {
     const inputRef= useRef(null);
     const [formData, setFormData] = useState({
      username:"",
      password: "",
     });
    const navigate = useNavigate();
    
    useEffect(()=>{
    inputRef.current.focus();
    },[])

    const onFinish = async(event)=>{
      try {
        event.preventDefault();
        console.log('Form submitted with data:', formData);
        const response = await LoginUser(formData);
        if(response.success){
          message.success(response.message);
          localStorage.setItem("token",response.data);
          console.log(response);
          navigate("/");
        }
        else {
          message.error(response.message);
        }
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  return (
    <>
  <Navbar></Navbar>
  <div className='container'>
    <form className='form' action="" onSubmit={onFinish}>
       <div className="input-container">
       <label className='label' htmlFor="Username">Username*</label>
       <input className='input-field' ref={inputRef} name="username" type="text" required="true" value={formData.username} onChange={handleInputChange}/>
       </div> 
       <div className='input-container'>
       <label className='label' htmlFor="Password">Password*</label>
       <input className='input-field' name="password" type="text" required="true" value={formData.password} onChange={handleInputChange}/>
       </div>

       <button type='submit' className='button css-button-3d--sky'>Login</button>
       <p className='last-para'>Don't have an account? <span className='sign-up' onClick={()=> navigate("/register")}>Sign Up</span></p>
    </form>
    </div>
    </>
  
  )
}

export default Login