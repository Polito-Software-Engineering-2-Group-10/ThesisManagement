import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplyToProposal from './pages/ApplyToProposal';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import API from './API';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // if the user is already logged in I save the user's information
        const user = await API.getUserInfo();
        setLoggedIn(true);
        //console.log(user);
        setUser(user);
      } catch (err) {
        // The user is not authenticated yet I don't have to perform any action
        //handleError(err);
      }
    };
    checkAuth();
  }, []);


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    
  }



  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);  
  }

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={loggedIn ? <MainPage logout={doLogOut} user={user}/> : <Navigate replace to='/login' /> }></Route>
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginPage loginSuccessful={loginSuccessful} />}  />
        <Route path='/apply' element={<ApplyToProposal logout={doLogOut}/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
