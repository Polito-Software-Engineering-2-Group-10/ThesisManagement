import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplyToProposal from './pages/ApplyToProposal';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import BrowseAppDecision from './pages/BrowseApplicationDecision.jsx';
import ProposalForm from './pages/ProposalForm';
import API from './API';
import SearchForProposals from "./pages/SearchForProposals.jsx";
import useNotification from './hooks/useNotifcation.js';
import AppContext from './AppContext.jsx';

import BrowseProposal from './pages/BrowseProposal';
import BrowseAndAcceptApplication from './pages/BrowseAndAcceptApplication.jsx';

function App() {
  const notify =useNotification();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [proposalsDirty, setProposalsDirty] = useState(true);
  const [appList, setAppList] = useState(undefined);

  const [proposalList, setProposalList] = useState(null);
  const fetchData = async () =>{
    if (user !== null && user.role === 'teacher') {
        const result = await API.getTeacherProposals();
        setProposalList(result);
    }
  }
  useEffect(() => {
    if (proposalsDirty) {
        fetchData();
        setProposalsDirty(false);
    }
  }, [proposalsDirty]);

  const fetchTeacherAppsList = async () =>{
    const result = await API.getApplicationsListTeacher();
    setAppList(result);
  }
  
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
                fetchData();
                fetchTeacherAppsList();
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
    if (typeof user.saml !== 'undefined') {
        await API.logOutWithSaml();
    } else {
        await API.logOut();
    }
    setLoggedIn(false);
    setUser(null);
    setUserDetail(null);
  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }

  function addApplication(application, success_callback, error_callback){
    API.addApplication(application)
      .then(() => { 
        setDirty(true); 
        success_callback(); 
      })
      .catch(
        (err) => 
        error_callback()
        );
  }

  const contextObject = {
    proposalsDirty: proposalsDirty,
    setProposalsDirty: setProposalsDirty,
  };


  return (
    <>
    <BrowserRouter>
      <AppContext.Provider value={contextObject}>
        <Routes>
            <Route path='/*' element={<MainPage loggedIn={loggedIn} logout={doLogOut} user={user} userDetail={userDetail}/>}></Route>
            <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}  />
            <Route path='/applyToProp/:propId' element={<ApplyToProposal addApplication={addApplication} loggedIn={loggedIn} logout={doLogOut} user={user}/>}></Route>
            <Route path='/browseAppDec' element={loggedIn ? <BrowseAppDecision appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/search' element={<SearchForProposals loggedIn={loggedIn} logout={doLogOut} user={user}/>}></Route>
            <Route path='/insert' element={<ProposalForm teacherDetail={userDetail} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/>}></Route>   
            <Route path='/proposal' element={loggedIn ? <BrowseProposal setProposalDirty={setProposalsDirty} proposalList={proposalList} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/browseApp' element={loggedIn ? <BrowseAndAcceptApplication appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user} updateAppList={fetchTeacherAppsList}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/updateProposal/:thesisId' element={loggedIn ? <ProposalForm loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>  
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
