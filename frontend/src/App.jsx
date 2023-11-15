import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplyToProposal from './pages/ApplyToProposal';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import BrowseAppDecision from './pages/BrowseApplicationDecision.jsx';
import API from './API.jsx';
import SearchForProposals from "./pages/SearchForProposals.jsx";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [appList, setAppList] = useState(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // if the user is already logged in I save the user's information
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        setDirty(true);
      } catch (err) {
        // The user is not authenticated yet I don't have to perform any action
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(()=> {
    if(user && dirty){
      if(user.role=='teacher'){
        API.getTeacherDetail()
            .then((teacher) => {
                setUserDetail(teacher);
                setDirty(false);
            })
            .catch((err) => console.log(err));
      } else {
          API.getStudentDetail()
              .then((student) => {
                  setUserDetail(student);
                  API.getApplicationsList()
                    .then((list) => {
                        setAppList(list);
                        setDirty(false);
                    })
                    .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
      }
    }
  }, [dirty]);


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setUserDetail(null);
  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }

  function addApplication(application){
    API.addApplication(application)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<MainPage loggedIn={loggedIn} logout={doLogOut} user={user} userDetail={userDetail}/>}></Route>
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}  />
        <Route path='/applyToProp/:propId' element={loggedIn ? <ApplyToProposal addApplication={addApplication} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
        <Route path='/browseAppDec' element={loggedIn ? <BrowseAppDecision appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
        <Route path='/search' element={loggedIn ? <SearchForProposals loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
