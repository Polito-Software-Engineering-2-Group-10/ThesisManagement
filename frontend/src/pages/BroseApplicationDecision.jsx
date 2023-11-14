import {Container, Button, Card, Col, Row} from "react-bootstrap"
import dayjs from 'dayjs'



function BrowseAppDecision(props){

    return(
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            
        </>
    )
}

export default BrowseAppDecision;