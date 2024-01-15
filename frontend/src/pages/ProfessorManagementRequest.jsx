import {Accordion, Button, Container} from 'react-bootstrap';
import { Navigation } from './Navigation';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import '../styles/ClerkManagmentRequest.css';
import API from '../API';
import ConfirmModal from '../components/ConfirmModal';
import useNotification from '../hooks/useNotifcation';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccordionElement } from '../components/AccordionElement';

function ProfessorManagementRequest(props){

    return (
        <>
            <Navigation
                logout={props.logOut}
                loggedIn={props.loggedIn}
                user={props.user}
            />
            <ToastContainer/>
            <Container>
                <AccordionManagementRequestProfessor
                    reqList={props.reqList}
                    
                />
            </Container>
        </>
    );
}


const AccordionManagementRequestProfessor = (props) => {
    const [reqList, setReqList] = useState(props.reqList);
    const [studList, setStudList] = useState(undefined);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(undefined);
    const [status, setStatus] = useState(true);
    const [dirty, setDirty] = useState(false);

    const notify=useNotification();

    useEffect(() => {
        API.getAllStudents()
        .then((list) => setStudList(list))
        .catch((err) => console.log(err));
    }, [reqList]);
    
    useEffect(() => {
        API.getAllThesisRequestsProfessor()
                    .then((list) => {
                        setReqList(list);
                        setDirty(false);
                    })
                .catch((err) => console.log(err));
    }, [dirty]);

    const handleSubmitRequest = (request_id, status) => {
        API.AcceptOrRejectThesisRequestProfessor(request_id, status)
        .then(() => {
            setDirty(true);
            notify.success( status ? 'Thesis request accepted successfully!' : 'Thesis request rejected successfully!');
        })
        .catch((err) => notify.error(err));
    }

    const handleClick = (request_id, s) => {
        setSelectedRequest(request_id);
        setStatus(s);
        setShowModal(true);
    }
    

    return (
        <>
        <ToastContainer/>
        <div>
      
            {/* This modal prevent the clerk to directly accept a proposal */}
            <ConfirmModal 
                title = {status ? "Do you want to accept the request?" : "Do you want to reject the request?"}
                text  = {status ? "The selected request will be visible for the professor." : "The selected request will be deleted."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>handleSubmitRequest(selectedRequest, status)}
            />

            {   /* IF the are no requests, the accordions are not showed */
                reqList ? (
                    reqList.length==0 ? <h3 style={{textAlign: 'center'}}>There are no requests to accept</h3> 
                    :
                    <>
                    <h1 style={{textAlign: 'center', marginBottom: '40px'}}>Thesis Requests List</h1>
                    <Accordion defaultActiveKey="0">
                    {
                        reqList.map((request, index) => {
                            

                                        {/*
                                            studList ? studList.filter((s) =>  s.id == request.student_id)
                                            .map((s, studentIndex) => {
                                                return (
                                                    <div key={studentIndex}>
                                                        <p><b>Student: </b> {s.name} {s.surname}</p> 
                                                        <p><b>Student Mail: </b> {s.email}</p>
                                                    </div> 
                                                ) 
                                            }) : ''

                                        <p><b>Apply Date: </b> {dayjs(request.apply_date).format('YYYY-MM-DD')}</p>

                                        <div className="accordion-row-buttons">
                                            <Button variant="success" className="clerkBtn" onClick={() => handleClick(request.id, true)}>Accept</Button>
                                            <Button variant="danger"  className="clerkBtn" onClick={() => handleClick(request.id, false)}>Reject</Button>
                                        </div>
                                        */}

                            return (
                                <AccordionElement
                                    key={index}
                                    title={request.title}
                                    id={request.id}
                                    supervisor={request.supervisor}
                                    coSupervisor={request.co_supervisor}
                                    description={request.description}
                                    student={
                                        studList ? studList.filter((s) =>  s.id == request.student_id)
                                            .map((s, studentIndex) => {
                                                return (
                                                    {name: s.name + " " + s.surname, email: s.email}
                                                ) 
                                        }) : ''
                                    }
                                    actions={{
                                        accept: () => handleClick(request.id, 1),
                                        reject: () => handleClick(request.id, 3)
                                    }}
                                />
                            )
                        })
                    }
                    </Accordion>
                </>
                )
                :
                ''
            }
        </div>
        </>
    )

}

export default ProfessorManagementRequest;