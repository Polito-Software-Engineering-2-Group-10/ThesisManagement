import "../styles/form.css"
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { Navigation } from "./Navigation";
import API from '../API';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import "/src/index.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";


const ThesisRequest = (props) => {

    const [actualProp, setActualProp] = useState(undefined);
    const [propList, setPropList] = useState(undefined);

    useEffect(() => {
        API.getAllProposals()
            .then((list) => setPropList(list))
            .catch((err) => console.log(err))
    }, [props.appList]);

    return (
        <>
            <ToastContainer />
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user} />

            <div className="my-3 text-center fw-bold fs-1" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <h2>Make a Thesis Request</h2>
            </div>

            <Tabs style={{ fontWeight: 'bold', margin: '0 auto', width: '60%', display: "flex", alignItems: 'center', justifyContent: 'center' }}
                defaultActiveKey="applications"
                className="mb-3"

            >
                <Tab eventKey="applications" title="Choose from accepted applications">
                    <Accordion defaultActiveKey="0">
                        <Container style={{ width: '70%' }}>
                            {

                                (props.appList && propList) ? props.appList.map((app, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col>
                                                <Accordion.Item eventKey={index} onClick={() => {
                                                    return (
                                                        setActualProp(propList.filter((p) => p.id == app.proposal_id))
                                                    )
                                                    }}>
                                                    <Accordion.Header>{app.thesis_title}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <Form>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Title</Form.Label>
                                                                <Form.Control type="text" defaultValue={app.thesis_title} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Description</Form.Label>
                                                                <Form.Control as="textarea" rows={5} defaultValue={actualProp?actualProp[0].description: ''} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Supervisor</Form.Label>
                                                                <Form.Control type="text" disabled defaultValue={`${app.teacher_surname} ${app.teacher_name}`} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Co-Supervisors</Form.Label>
                                                                { actualProp ? (
                                                                    actualProp[0].co_supervisor.length !=0 ? 
                                                                    <Form.Control type="text" disabled value={`${actualProp[0].co_supervisor}`} />
                                                                    : <Form.Control type="text" disabled value='No co-supervisor for this proposal' />
                                                                ) : ''}
                                                                
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Application Date</Form.Label>
                                                                <Form.Control disabled type="text" defaultValue={dayjs().format('YYYY-MM-DD')} />
                                                                <Form.Text id="passwordHelpBlock" muted>
                                                                    The request date will be set to today's date.
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Form>

                                                        <Button className="m-2" variant="success" type="submit">Send Request</Button>&nbsp;

                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Col>
                                        </Row>
                                    )

                                }) : ''
                            }
                        </Container>
                    </Accordion>

                </Tab>
                <Tab eventKey="proposals" title="Choose from other thesis proposals">

                </Tab>
            </Tabs >
        </>
    )
}

export default ThesisRequest;