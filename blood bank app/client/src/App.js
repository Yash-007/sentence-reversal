import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedPage from "./components/ProtectedPage";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import Profile from "./pages/Profile";

function App() {
  const {loading} = useSelector((state)=> state.loaders);
  return (
 <>
  {loading && <Spinner></Spinner>}
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedPage><Home/></ProtectedPage>}></Route>
      <Route path="/profile" element={<ProtectedPage><Profile/></ProtectedPage>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>      
    </Routes>
  </BrowserRouter>
 </>
  );
}

export default App;
