import React, { useEffect, useRef, useState } from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom';
import Home from '../Home/Home';
import { RegisterUser } from '../api calls/users';
import { message} from 'antd';
import Navbar from '../Home/Navbar';

function Register() {
  const inputRef= useRef(null);
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: "",
    confirmpassword: "" 
   });
    const navigate = useNavigate();

    useEffect(()=>{
      inputRef.current.focus();
      },[]);
    
    const onFinish = async(event)=>{
      try {
        event.preventDefault();
        if(formData.password !== formData.confirmpassword){
         throw new Error("Password and Confirm Password must be same");
      }
        console.log('Form submitted with data:', formData);
        const response = await RegisterUser(formData);
        if(response.success){
          message.success(response.message);
          console.log(response);
          navigate("/login");
        }
        else {
          throw new Error(response.message);
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
       <label className='label' htmlFor="Email">Email*</label>
       <input className='input-field' ref={inputRef} name="email" value={formData.email} onChange={handleInputChange} type="text" required="true"/>
       </div> 
       <div className="input-container">
       <label className='label' htmlFor="Username">Username*</label>
       <input className='input-field' name="username" value={formData.username} onChange={handleInputChange} type="text" required="true"/>
       </div> 
       <div className="input-container">
       <label className='label' htmlFor="Password">Password*</label>
       <input className='input-field' name="password" value={formData.password} onChange={handleInputChange} type="text" required="true"/>
       </div> 
       <div className='input-container'>
       <label className='label' htmlFor="Confirm Password">Confirm Password*</label>
       <input className='input-field' name="confirmpassword" value={formData.confirmpassword} onChange={handleInputChange} type="text" required="true"/>
       </div>

       <button type='submit' className='button css-button-3d--sky'>Register</button>
       <p className='last-para'>Already have an account? <span className='sign-up' onClick={()=>navigate("/login")}>Sign in</span></p>
    </form>
    </div>
    </>
 
  )
}

export default Register