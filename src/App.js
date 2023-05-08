import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import './styles/App.css';

const App = () => {
  const { loggedIn, userData, userDoc } = useAuthContext();
  const [profileUser, setProfileUser] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={loggedIn ? <Home setProfileUser={setProfileUser}/> : <Navigate to='/sign-in' />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/messages' element={loggedIn ? <Messages /> : <Navigate to='/sign-in' />} />
        <Route exact path='/profile' element={loggedIn ? <Profile profileUser={profileUser} setProfileUser={setProfileUser}/> : <Navigate to='/sign-in' />} />
        <Route path='/profile/:id' element={loggedIn ? <Profile profileUser={profileUser} setProfileUser={setProfileUser}/> : <Navigate to='/sign-in' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
