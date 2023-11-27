import {Navbar, Nav,Container,Button, Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../AppContext';
import API from '../API'

function Navigation(props) {
    const { setProposalsDirty } = useContext(AppContext);
    const handleVirtualClockClick = () => {
        const date = document.getElementById('virtual-clock').value;
        API.setVirtualClock(date);
        setProposalsDirty(true);
    };
    return (
      <Navbar expand="lg" bg='primary' data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Thesis Management</Navbar.Brand>
          { props.loggedIn ? 
              <Nav className="justify-content-center">
                <Nav.Item>
                  <Nav.Link>Logged in as: {props.user.name} {props.user.surname}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Form.Control type="date" id="virtual-clock"></Form.Control>
                    <Button onClick={() => handleVirtualClockClick()}>Set virtual clock</Button>
                </Nav.Item>
              </Nav> : ""
          }
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              { props.loggedIn ? <Button className='mx-2' variant='light' onClick={props.logout}><i className="bi bi-box-arrow-left"></i> Logout</Button> : <Link to='/login'><Button className='mx-2' variant='light'><i className="bi bi-person"></i> Login</Button></Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
    
}

export { Navigation };
