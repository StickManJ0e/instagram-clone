import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Post from './pages/Post';
import './styles/App.css';

const App = () => {
  const { loggedIn, userData, userDoc } = useAuthContext();
  const [currentPopUp, setCurrentPopUp] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={loggedIn ? <Home currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/messages' element={loggedIn ? <Messages /> : <Navigate to='/sign-in' />} />
        <Route exact path='/profile/:id' element={loggedIn ? <Profile /> : <Navigate to='/sign-in' />} />
        <Route exact path='/settings/edit' element={loggedIn ? <Settings menu={'edit'} currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
        <Route exact path='/settings/account' element={loggedIn ? <Settings menu={'account'} currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
        <Route exact path='/post/:id' element={loggedIn ? <Post setCurrentPopUp={setCurrentPopUp}/> : <Navigate to='/sign-in' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
