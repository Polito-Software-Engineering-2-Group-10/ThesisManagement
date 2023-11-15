import { Navigation } from "./Navigation";
import Infobox from "./InfoBox.jsx";
import SearchForProposals from "./SearchForProposals";
import ApplyToProposal from "./ApplyToProposal";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';
import ProposalForm from "./ProposalForm";
import API from "../API";

function MainPage(props){

    return(
        <>
            { props.loggedIn ? 
                <>
                    <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
                    <Infobox loggedIn={props.loggedIn} user={props.user} userDetail={props.userDetail}></Infobox>
                </>
                :
                <SearchForProposals logout={props.logout} loggedIn={props.loggedIn} user={props.user}></SearchForProposals>}
        </>
    )
}

export default MainPage;
