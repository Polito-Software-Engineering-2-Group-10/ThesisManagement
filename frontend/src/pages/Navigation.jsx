import {Navbar, Nav,Container,Button} from 'react-bootstrap';
import { Link, useMatch } from 'react-router-dom';
import useNotification from '../hooks/useNotifcation';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Navigation(props) {
  const notify=useNotification();
    return (
      <>
      <ToastContainer/>
      <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        
        <Container>
        
          <Navbar.Brand href="/">Thesis Management</Navbar.Brand>
          {props.loggedIn ? (
            <Nav className="justify-content-center">
              <Nav.Item>
                <Nav.Link>
                  Logged in as: {props.user.name} {props.user.surname}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          ) : (
            ""
          )}
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
            <Button
              className="mx-2"
              variant="light"
              onClick={() =>notify.success("Hey!")}
              
            >
              <i className="bi bi-box-arrow-left"></i> Notify
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </>
    );
    
}

export { Navigation };
