import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Table, Button, Badge, Card } from 'react-bootstrap';
import { Navigation } from './Navigation.jsx';
import API from "../API";

function BrowseAndAcceptApplication(props) {
    
    let applicationList = API.
    

    return (
        <>
            <div id="left-box">
                <input id="search" />
        
                <Table>
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Thesis title</th>
                            <th>Application Date</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
                    
            </div>
        
            <div id="right-box">
                <h1>Thesis Title</h1>
                <p>Student Number: </p> 
                <p>Name:</p>
                <p>Surname:</p>
                <p>Application Date: </p>
                <p>Gender:</p>
                <p>Nationality: </p>
                <p>Career: </p>
                <p>Enrollment Year: </p>
                <a href="#">Download CV</a>
        
                <div>
                    <Button variant="success">Accept</Button>
                    <Button variant="danger">Decline</Button>
                </div>
            </div>
        </>
    );
}
export default BrowseAndAcceptApplication;
