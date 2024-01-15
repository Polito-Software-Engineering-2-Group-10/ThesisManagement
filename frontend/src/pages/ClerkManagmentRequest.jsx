import {Accordion, Button} from 'react-bootstrap';
import { Navigation } from './Navigation';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import '../styles/ClerkManagmentRequest.css';
import API from '../API';
import ConfirmModal from '../components/ConfirmModal';
import useNotification from '../hooks/useNotifcation';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccessControlRedirect from '../components/AccessControlRedirect';

const ClerkManagmentRequest = (props) => {
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
        API.getAllThesisRequests()
                    .then((list) => {
                        setReqList(list);
                        setDirty(false);
                    })
                .catch((err) => console.log(err));
    }, [dirty]);

    const handleSubmitRequest = (request_id, status) => {
        API.AcceptOrRejectThesisRequestClerk(request_id, status)
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
        <AccessControlRedirect roles={['clerk']} user={props.user} loggedIn={props.loggedIn}/>
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
                            
                            return (
                                <Accordion.Item key={index} eventKey={index} className='accordion-row'>
                                    <Accordion.Header>{request.title}</Accordion.Header>
                                    <Accordion.Body>
                                        <p><b>Description:</b> {request.description}</p>
                                        <p><b>Supervisor: </b> {request.supervisor}</p>
                                        <p><b>Co-Supervisors: </b> {request.co_supervisor.length == 0 ? 'No cosupervisor': `${request.co_supervisor}`}</p>
                                        {
                                            studList ? studList.filter((s) =>  s.id == request.student_id)
                                            .map((s, studentIndex) => {
                                                return (
                                                    <div key={studentIndex}>
                                                        <p><b>Student: </b> {s.name} {s.surname}</p> 
                                                        <p><b>Student Mail: </b> {s.email}</p>
                                                    </div> 
                                                ) 
                                            }) : ''
                                        }
                                        <p><b>Apply Date: </b> {dayjs(request.apply_date).format('YYYY-MM-DD')}</p>

                                        <div className="accordion-row-buttons">
                                            <Button variant="success" className="clerkBtn" onClick={() => handleClick(request.id, true)}>Accept</Button>
                                            <Button variant="danger"  className="clerkBtn" onClick={() => handleClick(request.id, false)}>Reject</Button>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
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

export default ClerkManagmentRequest;




/*
This components creates a row for a request as an accordion, with all the required informations inside it.
*/ 
/*const AccordionRow = (props) => {
    
    const {id, title, description, apply_date, supervisor, co_supervisor, student} = props; 

    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            <p><b>Description:</b> {description}</p>
            <p><b>Supervisor: </b> {supervisor}</p>
            <p><b>Co-Supervisors: </b> {co_supervisor.length == 0 ? 'No cosupervisor': `${co_supervisor}`}</p>
            <p><b>Student: </b> {student[0].name} {student[0].surname}</p>
            <p><b>Student mail: </b> {student[0].email} </p>
            <p><b>Apply Date: </b> {dayjs(apply_date).format('YYYY-MM-DD')}</p>

            <div className="accordion-row-buttons">
                <Button variant="success" onClick={handleSubmitRequest(id, true)}>Accept</Button>
                <Button variant="danger"  onClick={handleSubmitRequest(id, false)}>Reject</Button>
            </div>
        </Accordion.Body>
      </Accordion.Item>
    ) 
}*/