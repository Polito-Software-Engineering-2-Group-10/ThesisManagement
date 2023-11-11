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
                        <p>Here you can manage all your thesis applications and see if there are some interesting proposals for you.</p>
                        <br></br>
                        <ul style={{textAlign: "center", listStyle: 'none', fontWeight: 'bold'}}>
                            <li>Name and Surname of the student</li>
                            <li>Type of degree</li>
                            <li>Enrollment Year</li>
                        </ul>
                    </Col>
                </Row>
                <Row style={{paddingTop: "60px"}}>
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
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default MainPage;