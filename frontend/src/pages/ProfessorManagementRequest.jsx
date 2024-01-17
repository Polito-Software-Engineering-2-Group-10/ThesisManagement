import {Accordion, Button, Container} from 'react-bootstrap';
import { Navigation } from './Navigation';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import '../styles/ClerkManagmentRequest.css';
import API from '../API';
import useNotification from '../hooks/useNotification';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccordionElement } from '../components/AccordionElement';
import ConfirmModal from '../components/ConfirmModal';
import InputModal   from '../components/InputModal';


function ProfessorManagementRequest(props){

    return (
        <>
            <Navigation
                logout={props.logout}
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

const STATUS_ACCEPTED = 1;
const STATUS_ASK_FOR_CHANGES = 2;
const STATUS_REJECTED = 3;

const AccordionManagementRequestProfessor = (props) => {
    const [reqList, setReqList] = useState(props.reqList);
    const [studList, setStudList] = useState(undefined);
    const [showModal, setShowModal] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(undefined);
    const [status, setStatus] = useState(STATUS_ACCEPTED);
    const [comment, setComment] = useState("");
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
            notify.success( status === STATUS_ACCEPTED ? 'Thesis request accepted successfully!' : 'Thesis request rejected successfully!');
        })
        .catch((err) => notify.error(err));
    }

    const handleClick = (request_id, s) => {
        setSelectedRequest(request_id);
        setStatus(s);
        
        if (s==2){ setShowInputModal(true); }
        else     { setShowModal(true);      }
    }
   
    const handleUpdateRequest = (request_id,status,comment) => {
        API.AskForChangesThesisRequestProfessor(request_id,status,comment)
        .then(()=>{
            setDirty(true);
            notify.success('Thesis request change have been sent');
        })
        .catch((err)=>notify.error(err));
    }

    return (
        <>
        <ToastContainer/>
        <div>
      
            {/* This modal prevent the clerk to directly accept a proposal */}
            <ConfirmModal 
                title = {status === STATUS_ACCEPTED ? "Do you want to accept the request?" : "Do you want to reject the request?"}
                text  = {status === STATUS_ACCEPTED ? "This marks the official start of the thesis, proceed?" : "The selected request will be rejected."}
                show  = {showModal} setShow={setShowModal} 
                onConfirm={()=>handleSubmitRequest(selectedRequest, status)}
            />

            <InputModal
                title = {"Ask student for changes"}
                show={showInputModal} setShow={setShowInputModal} comment={comment} setComment={setComment}
                onConfirm={()=>handleUpdateRequest(selectedRequest,status,comment)}
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
                                        update: () => handleClick(request.id, STATUS_ASK_FOR_CHANGES),
                                        accept: () => handleClick(request.id, STATUS_ACCEPTED),
                                        reject: () => handleClick(request.id, STATUS_REJECTED)
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