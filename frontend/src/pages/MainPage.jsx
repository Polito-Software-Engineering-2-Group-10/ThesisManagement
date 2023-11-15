import { Navigation } from "./Navigation";
import Infobox from "./InfoBox.jsx";

function MainPage(props){

    return(
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            <Infobox loggedIn={props.loggedIn} user={props.user} userDetail={props.userDetail}></Infobox>  
        </>
    )
}

export default MainPage;
