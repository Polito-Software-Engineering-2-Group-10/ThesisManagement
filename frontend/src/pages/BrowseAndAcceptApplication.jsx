import React, { useState } from 'react';
import {Table, Button} from 'react-bootstrap';
import { Navigation } from './Navigation.jsx';


function BrowseAndAcceptApplication(props) {

    let {appList} = props;

    return (
        <>
        <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            <div id="left-box" style={{width: 60+'%'}}>
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
