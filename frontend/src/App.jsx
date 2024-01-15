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
import ThesisRequest from './pages/ThesisRequest.jsx';
import useNotification from './hooks/useNotifcation.js';
import AppContext from './AppContext.jsx';

import BrowseProposal from './pages/BrowseProposal';
import BrowseArchivedProposals from './pages/BrowseArchivedProposals';
import BrowseAndAcceptApplication from './pages/BrowseAndAcceptApplication.jsx';
import ClerkManagmentRequest from './pages/ClerkManagmentRequest.jsx';
import ProfessorManagementRequest from './pages/ProfessorManagementRequest.jsx';

function App() {
  const notify =useNotification();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [proposalsDirty, setProposalsDirty] = useState(true);
  const [appList, setAppList] = useState(undefined);
  const [reqList, setReqList] = useState(undefined);

  // proposal lists
  const [proposalList, setProposalList] = useState(null);
  const [cosupervisorProposalList, setCosupervisorProposalList] = useState(null);


  // fetching data from the server
  const fetchData = async () =>{
    if (user !== null && user.role === 'teacher') {
        // get the list of proposals for which the teacher is a supervisor
        const result = await API.getTeacherProposals();
        setProposalList(result);
        
        // get the list of proposals for which the teacher is a cosupervisor
        const cosupervisorResult = await API.getCosupProposals();
        setCosupervisorProposalList(cosupervisorResult);
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
      if(user.role==='teacher'){
        API.getTeacherDetail()
            .then((teacher) => {
                setUserDetail(teacher);
                fetchData();
                fetchTeacherAppsList();
                setDirty(false);
               })
            .catch((err) => console.log(err));
      } else if (user.role === 'student') {
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
      } else if (user.role === 'clerk'){
        API.getClerkDetail()
              .then((clerk) => {
                  setUserDetail(clerk);
                  API.getAllThesisRequests()
                    .then((list) => {
                        setReqList(list);
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
        window.location.href = '/';
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
        error_callback(err)
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
            <Route path='/*' element={<MainPage loggedIn={loggedIn} logout={doLogOut} user={user} userDetail={userDetail} setProposalDirty={setProposalsDirty} proposalList={proposalList} cosupervisorProposalList={cosupervisorProposalList} />}></Route>
            <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}  />
            <Route path='/applyToProp/:propId' element={<ApplyToProposal addApplication={addApplication} loggedIn={loggedIn} logout={doLogOut} user={user}/>}></Route>
            <Route path='/browseAppDec' element={loggedIn ? <BrowseAppDecision appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/search' element={<SearchForProposals loggedIn={loggedIn} logout={doLogOut} user={user}/>}></Route>
            <Route path='/insert' element={<ProposalForm teacherDetail={userDetail} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/>}></Route>   
            <Route path='/proposal' element={loggedIn ? <BrowseProposal setProposalDirty={setProposalsDirty} proposalList={proposalList} loggedIn={loggedIn} logout={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/archivedProposals' element={loggedIn ? <BrowseArchivedProposals setProposalsDirty={setProposalsDirty} proposalsList={proposalList} loggedIn={loggedIn} logOut={doLogOut} user={user}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/browseApp' element={loggedIn ? <BrowseAndAcceptApplication appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user} updateAppList={fetchTeacherAppsList}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>
            <Route path='/updateProposal/:thesisId' element={loggedIn ? <ProposalForm teacherDetail={userDetail} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>  
            <Route path='/thesisRequest' element={loggedIn ? <ThesisRequest studentDetail={userDetail} appList={appList} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>  
            <Route path='/clerk' element={loggedIn ? <ClerkManagmentRequest clerk={userDetail} reqList={reqList} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>  
            <Route path='/managementRequest' element={loggedIn ? <ProfessorManagementRequest reqList={reqList} loggedIn={loggedIn} logout={doLogOut} user={user} proposalsDirty={proposalsDirty} setProposalsDirty={setProposalsDirty}/> : <LoginPage loggedIn={loggedIn} loginSuccessful={loginSuccessful} />}></Route>  
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
