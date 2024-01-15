import {Modal, Button} from 'react-bootstrap';
import { useState, useContext } from 'react';

import {Form} from 'react-bootstrap';

import "../index.css"

function ConfirmModal(props){
    const { show, setShow } = props;
    const [value, setValue]=useState("");

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Comments</Form.Label>
                    <Form.Control as="textarea" value={value} onChange={(event)=> {
                        setValue(event.target.value);
                    }} onInput={()=>{props.setComment(value);}}/>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="confirm" onClick={() => {setShow(false); console.log("value vale => "+value); props.onConfirm();}}>
                   Suggest changes 
                </Button>
                <Button variant="cancel" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                
            </Modal.Footer>
        </Modal>
    );
}


export default ConfirmModal;