import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './styles/App.css';
import { useParams } from 'react-router-dom';

const App = () => {
  const { loggedIn, userData, userDoc } = useAuthContext();
  const [profileUser, setProfileUser] = useState();
  const [currentPopUp, setCurrentPopUp] = useState();
  const { profile } = useParams();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={loggedIn ? <Home setProfileUser={setProfileUser} currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/messages' element={loggedIn ? <Messages setProfileUser={setProfileUser} /> : <Navigate to='/sign-in' />} />
        <Route path='/profile/:id' element={loggedIn ? <Profile profileUser={profileUser} setProfileUser={setProfileUser} /> : <Navigate to='/sign-in' />} />
        <Route exact path='/settings/edit' element={loggedIn ? <Settings setProfileUser={setProfileUser} menu={'edit'} currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
        <Route exact path='/settings/account' element={loggedIn ? <Settings setProfileUser={setProfileUser} menu={'account'} currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> : <Navigate to='/sign-in' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
