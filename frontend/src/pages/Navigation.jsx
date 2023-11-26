import {Navbar, Nav,Container,Button} from 'react-bootstrap';
import { Link, useMatch } from 'react-router-dom';

function Navigation(props) {
    return (
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
    
}

export { Navigation };
