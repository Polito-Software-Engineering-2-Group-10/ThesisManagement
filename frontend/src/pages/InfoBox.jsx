import {Container, Button, Card, Col, Row} from "react-bootstrap"
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";
import "/src/index.css"
import BrowseProposal from "./BrowseProposal";
import SearchForProposals from "./SearchForProposals";
import ClerkManagmentRequest from "./ClerkManagmentRequest";
function InfoBox(props){
    const navigate = useNavigate();
    return(
        <>
        { (props.loggedIn && props.userDetail) ? 
                    ( props.user.role == 'teacher' ?
                    <Container >
                        
                        <BrowseProposal setProposalDirty={props.setProposalDirty} proposalList={props.proposalList} cosupervisorProposalList={props.cosupervisorProposalList} loggedIn={props.loggedIn} logout={props.doLogOut} user={props.user}/>


                    </Container>
                    : (props.user.role=="student")?
                    // student
                    <Container>

                        <SearchForProposals loggedIn={props.loggedIn} logout={props.doLogOut} user={props.user}/>

                    </Container>
                    :
                     <Container>
                       {
                       
                        <ClerkManagmentRequest/>
                   
                       }
                     </Container>
                    /*
                    <Container style={{width: "50%", marginTop: "30px"}}>


                       
                        <Row>
                            <Col style={{textAlign: "center"}}>
                                <h1 style={{textDecorationLine: "underline"}}>Thesis Management Menu</h1>
                                <div>
                                    <p>Here you can manage all your thesis applications and see if there are some interesting proposals for you.</p>
                                    <br></br>
                                    <ul style={{textAlign: "center", listStyle: 'none'}}>
                                        <li>Student <b>{props.userDetail.name} {props.userDetail.surname}</b></li>
                                        <li>Degree in <b>{props.userDetail.title_degree}({props.userDetail.cod_degree})</b></li>
                                        <li>Enrolled in <b>{dayjs(props.userDetail.enrollment_year).format('YYYY-MM-DD')}</b></li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "30px"}}>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Card onClick={()=> navigate('/search')} style={{ width: '18rem', cursor: 'pointer', margin: '0 auto'}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Search for a thesis proposal</Card.Title>
                                    <Card.Text>
                                        And choose which apply for
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Card onClick={() => navigate('/browseAppDec')} style={{ width: '18rem', cursor: 'pointer', margin: '0 auto', verticalAlign: "center"}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Browse Application Decisions</Card.Title>
                                    <Card.Text>
                                        To see how your applications went
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                        </Row>
                    </Container>
                        */
                    )
                 : 
                 //pagina non autenticato
                ''
                 }
                 </>
    )
}

export default InfoBox;