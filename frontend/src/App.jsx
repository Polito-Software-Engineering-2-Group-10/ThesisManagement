import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ApplyToProposal from './pages/ApplyToProposal';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SearchForProposals from "./pages/SearchForProposals.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<MainPage/>}></Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/apply' element={<ApplyToProposal/>}></Route>
        <Route path='/search' element={<SearchForProposals/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
