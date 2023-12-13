import "../styles/form.css"
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { Navigation } from "./Navigation";
import API from '../API';
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import "/src/index.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";

// TO DO
// - accettare qualche application in modo da implementare il filtro sulle application
// - aggiungere confirmationModal e popup
// - controllare che mandando una request questa sparisca dalle selezionabili


const ThesisRequest = (props) => {

    const [actualProp, setActualProp] = useState(undefined);
    const [propList, setPropList] = useState(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cosupervisors, setCosupervisors] = useState('');
    const [dirty, setDirty] = useState(false);
    const [acceptedPropId, setAcceptedPropId] = useState(undefined);

    useEffect(() => {
        if (props.studentDetail) {
            API.getAllProposalsForStudent(props.studentDetail.cod_degree)
                .then((list) => {
                    setPropList(list)
                })
                .catch((err) => console.log(err))
        }
    }, [props.studentDetail]);

    useEffect(() => {
        if (acceptedPropId) {
            API.getProposal(acceptedPropId)
                .then((p) => setActualProp(p))
                .catch((err) => console.log(err));
        }
    }, [acceptedPropId]);

    useEffect(() => {
        if (actualProp) {
            setDirty(true);
        }
    }, [actualProp]);

    useEffect(() => {
        if (dirty) {
            if (Array.isArray(actualProp)) {
                setTitle(actualProp[0].title);
                setDescription(actualProp[0].description);
                setCosupervisors(actualProp[0].co_supervisor.join(', '));
            }
            else{
                setTitle(actualProp.title);
                setDescription(actualProp.description);
                setCosupervisors(actualProp.co_supervisor.join(', '));
            }
            setDirty(false);
        }
    }, [dirty]);

    const handleSendThesisRequest = (event) => {
        event.preventDefault();
        const cosupervisor_array = cosupervisors == '' ? [] : cosupervisors.split(/[,;]/).map((k) => k.trim());

        const thesis_request = {
            title: title,
            supervisor: Array.isArray(actualProp) ? actualProp[0].supervisor : actualProp.supervisor,
            co_supervisor: cosupervisor_array,
            description: description,
            apply_date: dayjs().format('YYYY-MM-DD')
        }

        console.log(thesis_request);
        /* API.applyRequest(thesis_request, actualProp[0].id)
            .then(response => {console.log(response)})
            .catch((err) => console.log(err)); */

    }

    return (
        <>
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
                                (props.appList && propList) ? props.appList.filter((a) => a.status == true).map((app, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col>
                                                <Accordion.Item eventKey={index}>
                                                    <Accordion.Header onClick={() => {
                                                        setAcceptedPropId(app.proposal_id);
                                                    }}>{app.thesis_title}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <Form>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Title</Form.Label>
                                                                {
                                                                    (actualProp && !dirty) ? (
                                                                        <Form.Control type="text" defaultValue={title} onChange={event => setTitle(event.target.value)} />
                                                                    )
                                                                        : ''
                                                                }
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Description</Form.Label>
                                                                {
                                                                    (actualProp && !dirty) ? (
                                                                        <Form.Control as="textarea" rows={5} defaultValue={description} onChange={event => setDescription(event.target.value)} />)
                                                                        : ''
                                                                }
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Supervisor</Form.Label>
                                                                <Form.Control type="text" disabled defaultValue={`${app.teacher_surname} ${app.teacher_name}`} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Co-Supervisors</Form.Label>
                                                                {(actualProp && !dirty) ? (
                                                                    cosupervisors?.length != 0 ?
                                                                        <Form.Control type="text" defaultValue={cosupervisors} onChange={event => setCosupervisors(event.target.value)} />
                                                                        : <Form.Control type="text" placeholder="No co-supervisor for this proposal" onChange={event => setCosupervisors(event.target.value)} />
                                                                ) : ''}

                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Thesis Request Date</Form.Label>
                                                                <Form.Control disabled type="text" defaultValue={dayjs().format('YYYY-MM-DD')} />
                                                                <Form.Text id="passwordHelpBlock" muted>
                                                                    The request date will be set to today's date.
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Form>

                                                        <Button className="m-2" variant="success" type="submit" onClick={handleSendThesisRequest}>Send Request</Button>&nbsp;

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
                <Tab eventKey="proposals" title="Or from other thesis proposals">
                    <Accordion defaultActiveKey="0" style={{ marginBottom: '30px' }}>
                        <Container style={{ width: '70%' }}>
                            {
                                (propList && props.appList) ? propList.filter((p) => {
                                    const acceptedPropIds = props.appList.map((a) => a.proposal_id);
                                    return !acceptedPropIds.includes(p.id)
                                }).map((prop, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col>
                                                <Accordion.Item eventKey={index}>
                                                    <Accordion.Header onClick={() => {
                                                        return (
                                                            setActualProp(propList.filter((p) => p.id == prop.id))
                                                        )
                                                    }}>{prop.title}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <Form>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Title</Form.Label>
                                                                {
                                                                    (actualProp && !dirty) ? (
                                                                        <Form.Control type="text" defaultValue={title} onChange={event => setTitle(event.target.value)} />
                                                                    )
                                                                        : ''
                                                                }
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Description</Form.Label>
                                                                {
                                                                    (actualProp && !dirty) ? (
                                                                        <Form.Control as="textarea" rows={5} defaultValue={description} onChange={event => setDescription(event.target.value)} />)
                                                                        : ''
                                                                }
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Supervisor</Form.Label>
                                                                <Form.Control type="text" disabled defaultValue={`${prop.teacher_surname} ${prop.teacher_name}`} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Co-Supervisors</Form.Label>
                                                                {(actualProp && !dirty) ? (
                                                                    cosupervisors?.length != 0 ?
                                                                        <Form.Control type="text" defaultValue={cosupervisors} onChange={event => setCosupervisors(event.target.value)} />
                                                                        : <Form.Control type="text" placeholder="No co-supervisor for this proposal" onChange={event => setCosupervisors(event.target.value)} />
                                                                ) : ''}

                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Thesis Request Date</Form.Label>
                                                                <Form.Control disabled type="text" defaultValue={dayjs().format('YYYY-MM-DD')} />
                                                                <Form.Text id="passwordHelpBlock" muted>
                                                                    The request date will be set to today's date.
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Form>

                                                        <Button className="m-2" variant="success" type="submit" onClick={handleSendThesisRequest}>Send Request</Button>&nbsp;

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
            </Tabs >
        </>
    )
}

export default ThesisRequest;