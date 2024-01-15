import "../styles/form.css"
import "../styles/ThesisRequest.css"
import 'bootstrap/dist/css/bootstrap.min.css';
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
import useNotification from '../hooks/useNotifcation';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AccessControlRedirect from "../components/AccessControlRedirect";



const ThesisRequestRow = ({
    app, onClickCallback, realTitle, index, actualProp, title, description,
    cosupervisors, handleSendThesisRequestClick, dirty, setTitle, setDescription,
    setCosupervisors, setAcTitle, setAcDescription, setAcCosupervisors
}) => (
    <Row>
        <Col>
            <Accordion.Item eventKey={index}>
                <Accordion.Header onClick={onClickCallback}>{realTitle}</Accordion.Header>
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
                                The request date will be set to today&apos;s date.
                            </Form.Text>
                        </Form.Group>
                    </Form>

                    <Button className="m-2" variant="success" type="submit" onClick={handleSendThesisRequestClick}>Send Request</Button>&nbsp;

                </Accordion.Body>
            </Accordion.Item>
        </Col>
    </Row>
);

const ActiveThesisRequestRow = ({ 
    req, index, onClickCallback, actualProp, showUpdate, setShowUpdate, actualReq, setActualReq,
    reqTitle, reqDesc, reqCosup, setReqCosup, setReqDesc, setReqTitle, setDirty, dirty, handleUpdateThesisRequest}) => (
    <Row>
        <Col>
            <Accordion.Item eventKey={index}>
                <Accordion.Header onClick={onClickCallback}>{req ? req.title : ''}</Accordion.Header>
                <Accordion.Body>
                    <div style={{ display: showUpdate ? 'none' : '' }}>
                        <p>
                            <b>Supervisor:</b> {actualProp ? actualProp.teacher_name + " " + actualProp.teacher_surname : ''}
                        </p>
                        <p>
                            <b>Supervisor mail:</b> {req.supervisor}
                        </p>
                        <p>
                            <b>Description:</b> {req.description}
                        </p>
                        <p>
                            <b>Co-Supervisors:</b> {req.co_supervisor?.length == 0 ? 'No co-supervisors for this proposal' : req.co_supervisor.join(', ')}
                        </p>
                        <p>
                            This thesis request has been sent on <b>{dayjs(req.apply_date).format('YYYY-MM-DD')}</b>
                        </p>
                        <hr></hr>
                        <p>
                            <b>{req.status_clerk ? 'This request has been accepted by the clerk management.' : (req.status_clerk == null ? 'This request has yet to be evaluated by the clerk.' : 'This request has been rejected by the clerk management.')}</b>
                        </p>
                        <p>
                            {/*// ASSUMED STATUSES: 0 = pending, 1 = approved, 2 = request for change, 3 = rejected */}
                            <b>{req.status_teacher==1 ? 'This request has been accepted by the supervisor.' : (req.status_teacher == null || req.status_teacher == 0 ? 'This request has yet to be evaluated by the supervisor.' : (req.status_teacher == 3 ? 'This request has been rejected by the supervisor.' : 'The supervisor asked for some changes.'))}</b>
                        </p>
                        <p>
                            <b>Comments: </b>{req.comment ? req.comment : 'No comments from the supervisor'}
                        </p>
                    </div>
                    <Form style={{ display: showUpdate ? '' : 'none' }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            {
                                (req) ? (
                                    <Form.Control type="text" value={reqTitle} onChange={event => setReqTitle(event.target.value)}/>
                                )
                                    : ''
                            }
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            {
                                (req) ? (
                                    <Form.Control as="textarea" rows={5} value={reqDesc} onChange={event => setReqDesc(event.target.value)}/>)
                                    : ''
                            }
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Supervisor</Form.Label>
                            <Form.Control type="text" disabled defaultValue={actualProp ? actualProp.teacher_name + ' ' + actualProp.teacher_surname : ''} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Co-Supervisors</Form.Label>
                            {(req) ? (
                                req.co_supervisor?.length != 0 ?
                                    <Form.Control type="text" value={reqCosup} onChange={event => setReqCosup(event.target.value)}/>
                                    : <Form.Control type="text" placeholder="No co-supervisor for this proposal" value={reqCosup} onChange={event => setReqCosup(event.target.value)}/>
                            ) : ''}

                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thesis Request Date</Form.Label>
                            <Form.Control disabled type="text" defaultValue={req ? dayjs(req.apply_date).format('YYYY-MM-DD') : ''} />
                            <Form.Text id="passwordHelpBlock" muted>
                                Request date won&apos;t change if you make changes.
                            </Form.Text>
                        </Form.Group>
                    </Form>

                    <Button className="m-2" style={{ display: (showUpdate || req.status_teacher!=2) ? 'none' : '' }} variant="success" onClick={() => { setShowUpdate(true); }}>Update Request</Button>&nbsp;
                    <Button className="m-2" style={{ display: showUpdate ? '' : 'none' }} type="submit" variant="success" onClick={handleUpdateThesisRequest}>Save Changes</Button>&nbsp;
                    <Button className="m-2" style={{ display: showUpdate ? '' : 'none' }} variant="danger" onClick={() => {setShowUpdate(false); setDirty(true);}}>Cancel</Button>&nbsp;

                </Accordion.Body>
            </Accordion.Item>
        </Col>
    </Row>
);

const ThesisRequest = (props) => {

    const [actualProp, setActualProp] = useState(undefined);
    const [propList, setPropList] = useState(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cosupervisors, setCosupervisors] = useState('');
    const [ACtitle, setAcTitle] = useState('');
    const [ACdescription, setAcDescription] = useState('');
    const [ACcosupervisors, setAcCosupervisors] = useState('');
    const [dirty, setDirty] = useState(false);
    const [acceptedPropId, setAcceptedPropId] = useState(undefined);
    const [showModal, setShowModal] = useState(false);
    const [showActive, setShowActive] = useState(false);
    const [activeRequests, setActiveRequests] = useState(undefined);
    const [showUpdate, setShowUpdate] = useState(false);
    const [actualReq, setActualReq] = useState(undefined);
    const [reqTitle, setReqTitle] = useState('');
    const [reqDesc, setReqDesc] = useState('');
    const [reqCosup, setReqCosup] = useState('');
    const [dirtyReq, setDirtyReq ] = useState(false);

    const notify = useNotification();

    useEffect(() => {
        if(dirtyReq){
            API.getAllThesisRequestsForStudent()
                .then((list) => {
                    setActiveRequests(list);
                    console.log(list);
                })
                .catch((err) => console.log(err));
                setDirtyReq(false);
        }
    }, [dirtyReq]);

    useEffect(() => {
        if (props.studentDetail) {
            API.getAllProposalsForStudent(props.studentDetail.cod_degree)
                .then((list) => {
                    setPropList(list);
                })
                .catch((err) => console.log(err));
            API.getAllThesisRequestsForStudent()
                .then((list) => {
                    setActiveRequests(list);
                })
                .catch((err) => console.log(err));
        }
    }, [props.studentDetail]);

    useEffect(() => {
        if (acceptedPropId) {
            API.getProposal(acceptedPropId)
                .then((p) => {
                    setActualProp(p);
                })
                .catch((err) => console.log(err));
        }
    }, [acceptedPropId]);

    useEffect(() => {
        if (dirty && actualReq) {
            setReqTitle(actualReq.title);
            setReqDesc(actualReq.description);
            setReqCosup(actualReq.co_supervisor.join(', '));
        }
        setDirty(false);
    }, [dirty, actualReq]);

    useEffect(() => {
        if (dirty && actualProp) {
            if (Array.isArray(actualProp)) {
                setTitle(actualProp[0].title);
                setDescription(actualProp[0].description);
                setCosupervisors(actualProp[0].co_supervisor.join(', '));
            }
            else {
                setTitle(actualProp.title);
                setDescription(actualProp.description);
                setCosupervisors(actualProp.co_supervisor.join(', '));
            }
            setDirty(false);
        }
    }, [dirty, actualProp]);

    const handleSendThesisRequestClick = (event) => {
        event.preventDefault();
        setShowModal(true);
    }

    const handleUpdateThesisRequest = (event) => {
        event.preventDefault();

        const cosupervisor_array = reqCosup == '' ? [] : reqCosup.split(/[,;]/).map((k) => k.trim());

        const thesis_request = {
            title: reqTitle,
            co_supervisor: cosupervisor_array,
            description: reqDesc
        }

        API.updateThesisRequest(actualReq.id, thesis_request)
            .then(() => {
                notify.success("Thesis request successfully modified");
                setShowUpdate(false);
                setDirtyReq(true);
            })
            .catch((err) =>
                notify.error(err.error));
    }

    const handleSendThesisRequest = () => {
        const cosupervisor_array = cosupervisors == '' ? [] : cosupervisors.split(/[,;]/).map((k) => k.trim());

        const thesis_request = {
            title: title,
            supervisor: Array.isArray(actualProp) ? actualProp[0].supervisor : actualProp.supervisor,
            co_supervisor: cosupervisor_array,
            description: description,
            apply_date: dayjs().format('YYYY-MM-DD')
        }
        API.applyRequest(thesis_request, Array.isArray(actualProp) ? actualProp[0].id : actualProp.id)
            .then(() => {
                notify.success("Thesis request successfully sent")
            })
            .catch((err) =>
                notify.error(err.error));

    }

    return (
        <>
            <AccessControlRedirect roles={['student']} loggedIn={props.loggedIn} user={props.user} />
            <ToastContainer />

            <ConfirmModal
                title={"Do you want to send a thesis request for this proposal?"}
                text={"The selected thesis request will be sent to the secretary."}
                show={showModal} setShow={setShowModal}
                onConfirm={() => handleSendThesisRequest()}
            />

            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user} />

            <Container style={{ marginTop: '2em' }}>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                        onClick={() => setShowActive(true)}
                        variant="outline-dark"
                        className="align-items-center request-btn"
                        style={{ marginLeft: 'auto', display: showActive ? 'none' : '' }}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" style={{ marginRight: '8px' }} />
                        <span>Your Active Thesis Requests</span>
                    </Button>

                    <Button
                        onClick={() => setShowActive(false)}
                        variant="outline-dark"
                        className="align-items-center request-btn"
                        style={{ marginLeft: 'auto', display: showActive ? '' : 'none' }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="mr-2" style={{ marginRight: '8px' }} />
                        <span>Make a Thesis Request</span>
                    </Button>

                </div>
            </Container>

            {/* parte make thesis request */}
            <div style={{ display: showActive ? 'none' : '' }}>
                <div className="my-3 text-center fw-bold fs-1" style={{ paddingBottom: '20px' }}>
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
                                    (props.appList && propList && activeRequests) ? props.appList.filter((a) => a.status == true)
                                    .filter((p)=>{
                                        const acceptedReqId = activeRequests.map((a) => a.proposal_id);
                                        return !acceptedReqId.includes(p.id);
                                    }).map((app, index) => {
                                        return <ThesisRequestRow
                                            onClickCallback={() => {
                                                API.getProposal(app.proposal_id)
                                                .then((prop) => {
                                                    setAcDescription(prop.description);
                                                    setAcTitle(prop.title);
                                                    setAcCosupervisors(prop.co_supervisor.join(', '));
                                                })
                                                .catch((err) => console.log(err));

                                                setAcceptedPropId(app.proposal_id);
                                                setDirty(true);
                                            }}
                                            realTitle={app.thesis_title}
                                            app={app}
                                            key={index} index={index} actualProp={actualProp} title={ACtitle} description={ACdescription}
                                            handleSendThesisRequestClick={handleSendThesisRequestClick} dirty={dirty}
                                            setTitle={setAcTitle} setDescription={setAcDescription} setCosupervisors={setAcCosupervisors} cosupervisors={ACcosupervisors}
                                        />
                                    }) : <h3>There are no accepted applications</h3>
                                }
                            </Container>
                        </Accordion>
                    </Tab>
                    <Tab eventKey="proposals" title="Or from other thesis proposals">
                        <Accordion defaultActiveKey="0" style={{ marginBottom: '30px' }}>
                            <Container style={{ width: '70%' }}>
                                {
                                    (propList && props.appList && activeRequests) ? propList.filter((p) => {
                                        const acceptedPropIds = props.appList.filter((a) => a.status === true).map((a) => a.proposal_id);
                                        return !acceptedPropIds.includes(p.id)
                                    }).filter((p)=>{
                                        const acceptedReqId = activeRequests.map((a) => a.proposal_id);
                                        return !acceptedReqId.includes(p.id);
                                    }).map((prop, index) => {
                                        return <ThesisRequestRow
                                            onClickCallback={() => {
                                                setActualProp(propList.filter((p) => p.id == prop.id));
                                                setDirty(true);
                                            }}
                                            realTitle={prop.title}
                                            app={prop}
                                            key={index} index={index} actualProp={actualProp} title={title} description={description}
                                            handleSendThesisRequestClick={handleSendThesisRequestClick} dirty={dirty}
                                            setTitle={setTitle} setDescription={setDescription} setCosupervisors={setCosupervisors} cosupervisors={cosupervisors}
                                        />
                                    }) : ''
                                }
                            </Container>
                        </Accordion>
                    </Tab>
                </Tabs >
            </div>

            {/* part see and update thesis request */}
            <div style={{ display: showActive ? '' : 'none' }}>
                <div className="my-3 text-center fw-bold fs-1" style={{ paddingBottom: '20px' }}>
                    <h2>Active Thesis Requests</h2>
                </div>

                <Accordion defaultActiveKey="0" style={{ marginBottom: '30px' }}>
                    <Container style={{ width: '70%' }}>
                        {
                            (activeRequests) ? activeRequests.map((req, index) => {
                                return <ActiveThesisRequestRow
                                    onClickCallback={() => {
                                        setActualProp(propList.filter((p) => p.id == req.proposal_id));
                                        setActualReq(req);
                                        setDirty(true);
                                    }}
                                    req={req} key={index} index={index} actualProp={actualProp ? actualProp[0] : ''}
                                    showUpdate={showUpdate} setShowUpdate={setShowUpdate} actualReq={actualReq} setActualReq={setActualReq}
                                    reqTitle={reqTitle} reqDesc={reqDesc} reqCosup={reqCosup}
                                    setReqTitle={setReqTitle} setReqDesc={setReqDesc} setReqCosup={setReqCosup} setDirty={setDirty} dirty={dirty}
                                    handleUpdateThesisRequest={handleUpdateThesisRequest}
                                />
                            }) : ''
                        }
                    </Container>
                </Accordion>
            </div>
        </>
    )
}

export default ThesisRequest;