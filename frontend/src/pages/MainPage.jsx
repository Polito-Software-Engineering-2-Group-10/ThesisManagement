import { Navigation } from "./Navigation";
import Infobox from "./InfoBox.jsx";
import SearchForProposals from "./SearchForProposals";

function MainPage(props){

    return(
        <>
            { props.loggedIn ? 
                <>
                    <Navigation userDetail={props.userDetail} logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
                    <Infobox loggedIn={props.loggedIn} user={props.user} userDetail={props.userDetail} setProposalDirty={props.setProposalsDirty} proposalList={props.proposalList}></Infobox>
                </>
                :
                <SearchForProposals logout={props.logout} loggedIn={props.loggedIn} user={props.user}></SearchForProposals>}
        </>
    )
}

export default MainPage;
