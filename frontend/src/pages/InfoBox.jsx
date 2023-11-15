import {Container, Button, Card, Col, Row} from "react-bootstrap"
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";

function InfoBox(props){

    const navigate = useNavigate();

    return(
        <>
        { (props.loggedIn && props.userDetail) ? 
                    ( props.user.role == 'teacher' ?
                    <Container style={{width: "50%", marginTop: "30px"}}>
                        <Row>
                            <Col style={{textAlign: "center"}}>
                                <h1 style={{textDecorationLine: "underline"}}>Thesis Management Menu</h1>
                                <div>
                                    <p>Here you can manage all your thesis proposals and see the state of them all.</p>
                                    <br></br>
                                    <ul style={{ textAlign: "center", listStyle: 'none'}}>
                                        <li>Professor <b>{props.userDetail.name} {props.userDetail.surname}</b></li>
                                        <li>Group: <b>{props.userDetail.group_name}</b></li>
                                        <li>Department: <b>{props.userDetail.department_short_name} - {props.userDetail.department_name}</b></li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "30px"}}>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Card style={{ width: '18rem', cursor: 'pointer', margin: '0 auto'}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Insert a new thesis proposal</Card.Title>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Card style={{ width: '18rem', cursor: 'pointer', margin: '0 auto', verticalAlign: "center"}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Browse all Applications</Card.Title>
                                    <Card.Text>
                                        if you want to accept or reject one
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Card style={{ width: '18rem', cursor: 'pointer', margin: '0 auto', verticalAlign: "center"}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Browse proposals</Card.Title>
                                    <Card.Text>
                                        and operate on them
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                        </Row>
                    </Container>
                    :
                    // student
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
                            <Card onClick={()=> navigate('/applyToProp')} style={{ width: '18rem', cursor: 'pointer', margin: '0 auto'}} bg="primary" text="light" className="mb-2">
                                <Card.Body>
                                    <Card.Title>Search for a thesis proposal</Card.Title>
                                    <Card.Text>
                                        And choose which apply for
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Card style={{ width: '18rem', cursor: 'pointer', margin: '0 auto', verticalAlign: "center"}} bg="primary" text="light" className="mb-2">
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
                    )
                 : 
                 //fare pagina non autenticato
                 ''}
                 </>
    )
}

export default InfoBox;