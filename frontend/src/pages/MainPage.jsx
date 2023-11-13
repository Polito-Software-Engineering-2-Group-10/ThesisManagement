import {Container, Button, Card, Col, Row} from "react-bootstrap"
import Navigation from "./Navigation";

function MainPage(props){
    return(
        <>
            <Navigation/>
            <Container style={{width: "50%", marginTop: "30px"}}>
                <Row>
                    <Col style={{textAlign: "center"}}>
                        <h1 style={{textDecorationLine: "underline"}}>Thesis Managment Menu</h1>
                        {/* student info */}
                        <div style={{display: "none"}}>
                            <p>Here you can manage all your thesis applications and see if there are some interesting proposals for you.</p>
                            <br></br>
                            <ul style={{textAlign: "center", listStyle: 'none', fontWeight: 'bold'}}>
                                <li>Name and Surname of the student</li>
                                <li>Type of degree</li>
                                <li>Enrollment Year</li>
                            </ul>
                        </div>
                        
                        {/* professor info */}
                        <div>
                            <p>Here you can manage all your thesis proposals and see the state of them all.</p>
                            <br></br>
                            <ul style={{ textAlign: "center", listStyle: 'none', fontWeight: 'bold'}}>
                                <li>Name and Surname of the professor</li>
                                <li>Group of the professor</li>
                                <li>Department</li>
                            </ul>
                        </div>
                        
                        
                    </Col>
                </Row>
                {/* professor interface */}
                <Row style={{paddingTop: "30px", display:"none"}}>
                    <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Card style={{ width: '18rem', cursor: 'pointer', margin: '0 auto'}} bg="primary" text="light" className="mb-2">
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
                {/* student cards */}
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
