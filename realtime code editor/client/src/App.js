import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Room from './routes/Room/Room';
import JoinRoom from './routes/joinRoom/JoinRoom';
import SocketWrapper from '../src/components/SocketWrapper';
function App() {
  return ( 
  <BrowserRouter>
  <Routes>
    <Route path="/" element= {<JoinRoom></JoinRoom>}></Route>
    <Route path="/room/:roomId" element= {<SocketWrapper><Room></Room></SocketWrapper>}></Route>
  </Routes>
  </BrowserRouter>
  );
}

export default App;
