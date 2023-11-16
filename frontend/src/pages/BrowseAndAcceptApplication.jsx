import React, { useState } from 'react';
import { Table, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Navigation } from './Navigation.jsx';
import dayjs from 'dayjs'
import API from '../API';

function BrowseAndAcceptApplication(props) {

    // to select a row in the table
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleApplicationClick = (application) => {
        setErrorMessage('');
        setSelectedApplication(application);
    }
    
    const handleAcceptRejectButtonClick = (id, status) => {
        API.acceptDeclineApplication(id, status).then((res) => {
            props.updateAppList().then(() => {
                setSelectedApplication(null);
            }).catch((err) => {
                setErrorMessage(`${JSON.stringify(err)}`); 
            })
        }).catch((err) => {
            setErrorMessage(`${JSON.stringify(err)}`); 
        });
    }
    
    return (
        <>
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
                <Row><Col>Name: </Col><Col>{selectedApplication.student_name}</Col></Row>
                <Row><Col>Surname: </Col><Col>{selectedApplication.student_surname}</Col></Row>
                <Row><Col>Application Date: </Col><Col>{dayjs(selectedApplication.apply_date).format('DD/MM/YYYY')}</Col></Row>
                <Row><Col>Gender: </Col><Col>{selectedApplication.student_gender}</Col></Row>
                <Row><Col>Nationality: </Col><Col>{selectedApplication.student_nationality}</Col></Row>
                <Row><Col>Career: </Col><Col>{selectedApplication.student_degree}</Col></Row>
                <Row><Col>Enrollment Year: </Col><Col>{dayjs(selectedApplication.student_ey).format('DD/MM/YYYY')}</Col></Row>   
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
                    <Button variant="success" onClick={() => handleAcceptRejectButtonClick(selectedApplication.id, true)} >Accept</Button>
                    <Button variant="danger"  onClick={() => handleAcceptRejectButtonClick(selectedApplication.id, false)}>Decline</Button>
                </Row>
                    : ""
                }
            </Container>
            : ""}
        </>
    );
}
export default BrowseAndAcceptApplication;
