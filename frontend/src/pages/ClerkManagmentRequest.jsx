import {Accordion, Button} from 'react-bootstrap';
import { Navigation } from './Navigation';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import '../styles/ClerkManagmentRequest.css';
import API from '../API';
import ConfirmModal from '../components/ConfirmModal';

const ClerkManagmentRequest = (props) => {
    const {reqList} = props;
    const [studList, setStudList] = useState(undefined);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        API.getAllStudents()
        .then((list) => setStudList(list))
        .catch((err) => console.log(err));
    }, [reqList])

    
    
    return (
            
        <div>
            <Navigation
                logout={props.logout}
                loggedIn={props.loggedIn}
                user={props.user}
            />
            {/* This modal prevent the clerk to directly accept a proposal */}
            <ConfirmModal 
                title = {"Do you want to accept the request?"}
                text  = {"The selected request will be visible for the professor."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>{}}
            />

            {   /* IF the are no requests, the accordions are not showed */
                (!reqList || !studList) ? 
                <p>There are no requests to accept</p>
                :
                <>
                    <Accordion defaultActiveKey="0">
                    {
                        reqList.map((request, index) => {
                            return (
                                <AccordionRow 
                                    key={index}
                                    id={index}
                                    title={request.title}
                                    description={request.description}
                                    supervisor={request.supervisor}
                                    apply_date={request.apply_date}
                                    student = { studList.filter((s) => s.id==request.student_id) }
                                    onAccept={() => console.log("accetto!")}
                                    onReject={() => console.log("rifiuto!")}
                                />
                            )
                        })
                    }
                    </Accordion>
                </>
            }
        </div>
    )

}

export default ClerkManagmentRequest;




/*
This components creates a row for a request as an accordion, with all the required informations inside it.
*/ 
const AccordionRow = (props) => {
    
    const {id, title, description, onAccept, onReject, apply_date, supervisor, student} = props;
    
    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            <p><b>Description:</b> {description}</p>
            <p><b>Supervisor: </b> {supervisor}</p>
            <p><b>Student: </b> {student[0].name} {student[0].surname}</p>
            <p><b>Apply Date: </b> {dayjs(apply_date).format('YYYY-MM-DD')}</p>

            <div className="accordion-row-buttons">
                <Button variant="success" onClick={onAccept}>Accept</Button>
                <Button variant="danger"  onClick={onReject}>Reject</Button>
            </div>
        </Accordion.Body>
      </Accordion.Item>
    ) 
}