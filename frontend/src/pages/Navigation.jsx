import { Navbar, Nav, Container, Button, Form, Modal, NavDropdown, NavbarCollapse } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    

    const location = useLocation();
    // const [title, setTitle] = useState(location.state?.pageTitle ? location.state.pageTitle : 'Thesis proposals');
    const title = "Thesis Management";

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
      <div id="navbar">
        
        <Container id="navbarTitle" >
            <img src="/src/img/LogoBlu.svg" onClick={()=>navigate('/')}/>

            <h1 className="title" onClick={()=>navigate('/')}>{title}</h1>  
        
        {props.loggedIn && (
            <Container  id="navbarClock">
                  <p>{virtualClock}</p>
                  <i
                    className="bi bi-calendar"
                    onClick={handleEditClick}
                  ></i>
            </Container>
          )}
        </Container>
        
        <Navbar collapseOnSelect className="color-nav" expand="lg" data-bs-theme="dark">
        <Container>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
        
            {props.loggedIn ? (
              <Nav>
                
                <div id="nav-links">
                  {props.user?.role==="teacher"?
                
                  <>
                    <Nav.Link onClick={()=>navigate("/insert")}>Insert proposal</Nav.Link>
                    <Nav.Link onClick={()=>navigate("/proposals")}>Browse Proposals</Nav.Link>
                    <Nav.Link onClick={()=>navigate("/BrowseApp")}>Browse Applications</Nav.Link>
                  </>
                  :
                  <>
                    <Nav.Link onClick={()=>navigate("/")}>Browse Proposals</Nav.Link>
                    <Nav.Link onClick={()=>navigate("/BrowseAppDec")}>Browse Applications</Nav.Link>
                    <Nav.Link onClick={() => navigate("/thesisRequest")}>Thesis Request</Nav.Link>
                  </>
                  }
                </div>

                  <NavDropdown title={props.user?.name + " " + props.user?.surname} id="basic-nav-dropdown">
                      <NavDropdown.Item  onClick={props.logout}>
                          <div>Logout</div>
                      </NavDropdown.Item>
                  </NavDropdown>
              </Nav>
            
            ) : (
              <Nav className="justify-content-end ">
                <Link className="justify-content-center align-self-center" to="/login">
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
    );
}

export { Navigation };
