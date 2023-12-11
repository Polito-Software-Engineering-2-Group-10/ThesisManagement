import {Modal, Button} from 'react-bootstrap';
import { useState, useContext } from 'react';
import "../index.css"

function ConfirmModal(props){
    
    const { show, setShow } = props;
    
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.text}</Modal.Body>
            <Modal.Footer>
                <Button variant="confirm" onClick={() => {setShow(false); props.onConfirm();}}>
                    Yes
                </Button>
                <Button variant="cancel" onClick={() => setShow(false)}>
                    No
                </Button>
                
            </Modal.Footer>
        </Modal>
    );
}


export default ConfirmModal;