import { useState } from 'react';
import { Table, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Navigation } from './Navigation.jsx';
import dayjs from 'dayjs'
import API from '../API';
import useNotification from '../hooks/useNotifcation';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function BrowseAndAcceptApplication(props) {

    // to select a row in the table
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const notify= useNotification();
    const handleApplicationClick = (application) => {
        setErrorMessage('');
        setSelectedApplication(application);
    }
    
    const handleAcceptRejectButtonClick = (id, status,teacher_name,teacher_surname,thesis_title,student_name,student_surname,student_gender, student_email) => {
        const mailInfo=
        {
            id: id,
            status:status,
            teacher_name:teacher_name,
            teacher_surname:teacher_surname,
            thesis_title:thesis_title,
            student_name:student_name,
            student_surname:student_surname,
            student_gender:student_gender,
            student_email: student_email
        }
        API.acceptDeclineApplication(mailInfo).then((res) => {
            props.updateAppList().then(() => {
                notify.success(`Student application ${status? 'accepted' : 'rejected' } correctly!`)
                setSelectedApplication(null);
            }).catch((err) => {
                notify.error(err)
                setErrorMessage(`${JSON.stringify(err)}`); 
            })
            
        }).catch((err) => {
            
            setErrorMessage(`${JSON.stringify(err)}`); 
        });
    }

    
    
    return (
        <>
            <ToastContainer/>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user} />
            <div id="left-box">
             { props.appList ?
                <Table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Thesis title</th>
                            <th>Application Date</th>
                            <th>Application Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.appList.map((result, index) => (
                            <tr key={result.id} onClick={() => handleApplicationClick(result)}
                                className={selectedApplication && selectedApplication.id === result.id ? 'table-primary' : ''}
                            >
                                <td>{`${result.student_surname} ${result.student_name}`}</td>
                                <td>{result.thesis_title}</td>
                                <td>{dayjs(result.apply_date).format('DD/MM/YYYY')}</td>
                                <td>{result.status !== null ? (result.status ? "Accepted" : "Rejected") : "Waiting"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                : ""
                }

            </div>
            {
                selectedApplication ? 
            <Container>
                <Row><h3>{selectedApplication.thesis_title}</h3></Row>
                <Row><Col><b>Name:</b> </Col><Col>{selectedApplication.student_name}</Col></Row>
                <Row><Col><b>Surname:</b> </Col><Col>{selectedApplication.student_surname}</Col></Row>
                <Row><Col><b>Application Date:</b> </Col><Col>{dayjs(selectedApplication.apply_date).format('DD/MM/YYYY')}</Col></Row>
                <Row><Col><b>Gender:</b> </Col><Col>{selectedApplication.student_gender}</Col></Row>
                <Row><Col><b>Nationality:</b> </Col><Col>{selectedApplication.student_nationality}</Col></Row>
                <Row><Col><b>Career:</b> </Col><Col>{selectedApplication.student_degree}</Col></Row>
                <Row><Col><b>Enrollment Year:</b> </Col><Col>{dayjs(selectedApplication.student_ey).format('DD/MM/YYYY')}</Col></Row>   
                {
                    errorMessage !== '' ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : null
                }             
                {
                    selectedApplication.status === null ?
                    
                <Row style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: '20px',
                    marginBottom: '50px'
                }} md={'auto'}>
                    <Button variant="success" onClick={() => handleAcceptRejectButtonClick(selectedApplication.id, true,props.user.name,props.user.surname,selectedApplication.thesis_title,selectedApplication.student_name,selectedApplication.student_surname,selectedApplication.student_gender, selectedApplication.student_email)} >Accept</Button>
                    <Button variant="danger"  onClick={() => handleAcceptRejectButtonClick(selectedApplication.id, false,props.user.name,props.user.surname,selectedApplication.thesis_title,selectedApplication.student_name,selectedApplication.student_surname,selectedApplication.student_gender, selectedApplication.student_email)}>Decline</Button>
                </Row>
                    : ""
                }
            </Container>
            : ""}
        </>
    );
}
export default BrowseAndAcceptApplication;
