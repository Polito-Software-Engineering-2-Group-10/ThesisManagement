import {Navbar, Nav,Container,Button, Form} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../AppContext';
import API from '../API'

import "../styles/navigation.css";

function Navigation(props) {
    const { setProposalsDirty } = useContext(AppContext);
    
    // necessary to use navigate() inside a function
    const navigate = useNavigate();

    const handleVirtualClockClick = (set) => {
        const date = document.getElementById('virtual-clock').value;
        if (set) {
            API.setVirtualClock(date);
        } else {
            API.resetVirtualClock();
        }
        setProposalsDirty(true);
    };
    return (
      <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        
        <Container>
          <Navbar.Brand onClick={()=>{navigate("/");}} className="brand">Thesis Management</Navbar.Brand>
          { props.loggedIn ? 
              <Nav className="justify-content-center">
                <Nav.Item>
                  <Nav.Link>Logged in as: {props.user.name} {props.user.surname}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Form.Control type="date" id="virtual-clock"></Form.Control>
                    <Button onClick={() => handleVirtualClockClick(true)}>Set virtual clock</Button>
                    <Button onClick={() => handleVirtualClockClick(false)}>Reset</Button>
                </Nav.Item>
              </Nav> : ""
          }
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {props.loggedIn ? (
                <Button className="mx-2" variant="light" onClick={props.logout}>
                  <i className="bi bi-box-arrow-left"></i> Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="mx-2" variant="light">
                    <i className="bi bi-person"></i> Login
                  </Button>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
    
}

export { Navigation };
