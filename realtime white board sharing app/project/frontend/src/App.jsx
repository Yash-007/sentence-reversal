import Forms from './components/Forms';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import RoomPage from './pages/RoomPage';
// import {BrowserRouter} from 'react-router';
function App() {

  return (
    <>
    <div className='container'>
     <Routes>
      <Route path="/" element={<Forms/>}/>
      <Route path="/:roomId" element={<RoomPage/>}/>
     </Routes>
    </div>
    </>
  )
}

export default App
