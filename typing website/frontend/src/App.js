import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Login from './Login/Login';
import Register from './Register/Register';
import Settings from './Settings/Settings';
import { useEffect, useState } from 'react';
import { ProtectedPage } from './Profile/Profile';

function App() {
  const [color, setColor] = useState({
    color: "black",
    bgColor: "black",
  });


  useEffect(() => {
    const getData = async () => {
      const COLOR = await localStorage.getItem("color");
      const BGCOLOR = await localStorage.getItem("bgColor");
      if (COLOR) {
        setColor((value) => {
          return {
            ...value,
            color: COLOR,
          }
        });
      }
      else {
        setColor((value) => {
          return {
            ...value,
            color: "black",
          }
        });
      }


      if (BGCOLOR) {
        setColor((value) => {
          return {
            ...value,
            bgColor: BGCOLOR,
          }
        });
      }
      else {
        setColor((value) => {
          return {
            ...value,
            bgColor: "yellow",
          }
        });
      }
    }
    getData();

  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home color={color} setColor={setColor}></Home>}> </Route>
          <Route path='/profile' element={<ProtectedPage color={color}> </ProtectedPage>}> </Route>
          <Route path='/login' element={<Login color={color} setColor={setColor}></Login>}> </Route>
          <Route path='/register' element={<Register color={color} setColor={setColor}></Register>}> </Route>
          <Route path='/settings' element={<Settings color={color} setColor={setColor}></Settings>}> </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
