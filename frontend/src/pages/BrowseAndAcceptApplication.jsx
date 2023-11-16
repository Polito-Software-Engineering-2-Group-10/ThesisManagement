import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Navigation } from './Navigation.jsx';
import dayjs from 'dayjs'
import API from '../API';

function BrowseAndAcceptApplication(props) {

    // to select a row in the table
    const [selectedApplication, setSelectedApplication] = useState(null);

    const handleApplicationClick = (application) => {
        setSelectedApplication(application);
    }
    
    
    return (
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user} />
            <div id="left-box">
             { props.appList ?
                <Table>
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Thesis title</th>
                            <th>Application Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.appList.map((result, index) => (
                            <tr key={result.id} onClick={() => handleApplicationClick(result)}
                                className={selectedApplication && selectedApplication.id === result.id ? 'table-primary' : ''}
                            >
                                <td>{result.student_id}</td>
                                <td>{result.thesis_title}</td>
                                <td>{dayjs(result.apply_date).format('DD/MM/YYYY')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                : ""
                }

            </div>
            {
                selectedApplication ? 
            <div id="right-box">
                <h1>{selectedApplication.thesis_title}</h1>
                <p>Student Number: {selectedApplication.student_id}</p>
                <p>Name: {selectedApplication.name}</p>
                <p>Surname: {selectedApplication.surname}</p>
                <p>Application Date: {dayjs(selectedApplication.apply_date).format('DD/MM/YYYY')}</p>
                <p>Gender: {selectedApplication.gender}</p>
                <p>Nationality: {selectedApplication.nationality}</p>
                <p>Career: {selectedApplication.cod_degree}</p>
                <p>Enrollment Year: {dayjs(selectedApplication.apply_date).format('DD/MM/YYYY')}</p>
                <a href="#">Download CV</a>
                
                {
                    selectedApplication.status == null ?
                <div>
                    <Button variant="success" onClick={() => API.acceptDeclineApplication(selectedApplication.id, true).then(()=>{setSelectedApplication(null)}).catch((err)=>console.log(err))} >Accept</Button>
                    <Button variant="danger"  onClick={() => API.acceptDeclineApplication(selectedApplication.id, false).then(()=>{setSelectedApplication(null)}).catch((err)=>console.log(err))}>Decline</Button>
                </div>
                    : ""
                }
            </div>
            : ""}
        </>
    );
}
export default BrowseAndAcceptApplication;
