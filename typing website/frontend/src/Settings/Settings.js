import React from 'react'
import Navbar from '../Home/Navbar'
import '../Settings/Settings.css';
import { setColor } from '../redux/colorSlice';
import { useDispatch } from 'react-redux';
function Settings(props) {
  const { color } = props;
  const dispatch = useDispatch();
  const handleChange = (value) => {
    if(value.bgColor === localStorage.getItem("bgColor")) return;
    localStorage.setItem("color", (value.color));
    localStorage.setItem("bgColor", (value.bgColor));
    window.location.reload();
  }

  return (
    <>
      <div style={{ color: color.color, backgroundColor: color.bgColor, height: "100vh" }}>
        <Navbar></Navbar>
        <h1 className='main-head'>Themes</h1>
        <div className='theme-container'>

          <div className='box' style={{ color: "#FFF0CE", backgroundColor: "#872341" }} onClick={() => {
            handleChange({ color: "#FFF0CE", bgColor: "#872341" });
          }}>
            TypeNow
          </div>

          <div className='box' style={{ color: "#3A4D39", backgroundColor: "#29ADB2" }} onClick={() => {
            handleChange({ color: "#3A4D39", bgColor: "#29ADB2" })
          }}>
            TypeNow</div>

          <div className='box' style={{ color: "#1D267D", backgroundColor: "#6CC4A1" }} onClick={() => {
            handleChange({ color: "#1D267D", bgColor: "#6CC4A1" })
          }}>
            TypeNow</div>

          <div className='box' style={{ color: "#F4E869", backgroundColor: "#164863" }} onClick={() => {
            handleChange({ color: "#F4E869", bgColor: "#164863" })
          }}>
            TypeNow</div>

          <div className='box' style={{ color: "#B6EAFA", backgroundColor: "#577D86" }} onClick={() => {
            handleChange({ color: "#B6EAFA", bgColor: "#577D86" })
          }}>
            TypeNow</div>

          <div className='box' style={{ color: "black", backgroundColor: "yellow" }} onClick={() => {
            handleChange({ color: "black", bgColor: "yellow" })
          }}>
            TypeNow</div>
        </div>
      </div>
    </>
  )
}

export default Settings