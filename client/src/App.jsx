import { Route, Routes  } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import GroupHome from './pages/Group/GroupHome';
import TakeUser from './pages/Group/TakeUser';
import Stream from './pages/Group/Stream';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/room/:roomId' element={<Room/>}></Route>
        <Route path='/meeting' element={<GroupHome/>}></Route>
        <Route path='/meeting/:meetingID' element={<TakeUser/>}></Route>
        <Route path='/stream/:meetingID' element={<Stream/>}></Route>
      </Routes>
    </div>
  )
}

export default App
