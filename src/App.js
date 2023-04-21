import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import './styles/App.css';

const App = () => {
  const { loggedIn } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={loggedIn ? <Home /> : <Navigate to='/sign-in' />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
