import {Container} from "react-bootstrap"
import Navigation from "./Navigation";

function MainPage(props){
    return(
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn}/>
            {props.user.role=="teacher"?
            <h1>Welcome back teacher: {props.user.name} {props.user.surname}</h1>
            :
            <h1>Welcome back student: {props.user.name} {props.user.surname}</h1>
            }
        </>
    )
}

export default MainPage;