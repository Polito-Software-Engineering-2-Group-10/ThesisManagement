import {Modal, Button} from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';

import {Form} from 'react-bootstrap';

import "../index.css"

function ConfirmModal(props){
    const { show, setShow } = props;
    const [value, setValue]=useState('');

    useEffect(() => {
        props.setComment(value);
        
      }, [value]);

    return (
      <Modal show={show} onHide={() => {setShow(false); setValue("");}}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                name="comment"
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="confirm"
            onClick={() => {
              setShow(false);
              props.onConfirm();
            }}
          >
            Suggest changes
          </Button>
          <Button variant="cancel" onClick={() => {setShow(false); setValue("");}}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
}


export default ConfirmModal;