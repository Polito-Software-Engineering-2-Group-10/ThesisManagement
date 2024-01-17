import {Container, Button, Col, Row, Table} from "react-bootstrap"
import dayjs from 'dayjs'
import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";

import {AccordionElement} from "../components/AccordionElement";
import { Accordion } from "react-bootstrap";

function BrowseAppDecision(props){

    const navigate = useNavigate();

    return(
        <>
        <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
        
        <Container>
            <h1 className="page-title">Application Decisions</h1>
            <Accordion>
            { props.appList ? 
              props.appList.map((a, index) => {
                return(
                    <AccordionElement 
                        key={index} 
                        id={a.id}
                        title={a.thesis_title} 
                        application={a.apply_date} 
                        status={ a.status === null ? 'Processing': (
                                 a.status ? 'Accepted' : 'Rejected'
                        )} 
                    />
                )
              })  
            : ''}
            </Accordion>
        </Container>
        </>
    )
}

export default BrowseAppDecision;
