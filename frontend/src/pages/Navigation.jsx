import { Navbar, Nav, Container, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import API from '../API'


import "../styles/navigation.css";

function Navigation(props) {
    const { setProposalsDirty } = useContext(AppContext);
    
    // necessary to use navigate() inside a function
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [virtualClock, setVirtualClock] = useState(new Date().toISOString().substring(0, 10));
    const [temporaryClock, setTemporaryClock] = useState(new Date().toISOString().substring(0, 10));

    const handleVirtualClockClick = (set) => {
        if(set){
            setVirtualClock(temporaryClock);
            API.setVirtualClock(temporaryClock);
        }
        else{
            setVirtualClock(new Date().toISOString().substring(0, 10))
            setTemporaryClock(new Date().toISOString().substring(0, 10));
            API.resetVirtualClock();
        }
        setProposalsDirty(true);
        handleCloseModal();
    };

    const handleEditClick = () => {
        setTemporaryClock(virtualClock);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setTemporaryClock(virtualClock);
        setShowModal(false);
    };

    return (
      <Navbar className="color-nav" expand="lg" data-bs-theme="dark">
    
        <Container>
          <Navbar.Brand href="/">
            
            <p 
            style={{
                    fontSize: "20px",
                    fontWeight: "bold"
                  }}
            className="d-inline-block align-center">Polito Thesis Management</p>
          </Navbar.Brand>
          {props.loggedIn && (
            <Nav
              className="justify-content-center"
              
            >
              <Nav.Item className="mt-2">
                <span
                  style={{
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {virtualClock}
                </span>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <i
                    className="bi bi-pencil mx-2"
                    onClick={handleEditClick}
                  ></i>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
          <div className="d-flex justify-content-center align-items-center flex-grow-1"></div>
          {props.loggedIn ? (
            <Nav className="justify-content-end">
              <Nav.Item className="mt-1" style={{ marginRight: "20px" }}>
                <span
                  style={{
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Logged in as:{" "}
                  <u>
                    {props.user.name} {props.user.surname}
                  </u>
                </span>
              </Nav.Item>
              <Nav.Item>
                <Button className="mx-2" variant="light" onClick={props.logout}>
                  <i className="bi bi-box-arrow-left"></i> LOGOUT
                </Button>
              </Nav.Item>
            </Nav>
          ) : (
            <Nav className="justify-content-end">
              <Link to="/login">
                <Button className="mx-2" variant="light">
                  <i className="bi bi-person-circle"></i> LOGIN
                </Button>
              </Link>
            </Nav>
          )}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Modify date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                type="date"
                value={temporaryClock}
                onChange={(e) => setTemporaryClock(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => handleVirtualClockClick(false)}
              >
                Reset to current date
              </Button>
              <Button
                variant="primary"
                onClick={() => handleVirtualClockClick(true)}
              >
                Set date
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </Navbar>
    );
}

export { Navigation };
