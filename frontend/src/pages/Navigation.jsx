import {Navbar, Nav,Container,Button} from 'react-bootstrap';



function Navigation(props) {

    return (
      <Navbar expand="lg" bg='primary' data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>Feature 1</Nav.Link>
            <Nav.Link>Feature 2</Nav.Link>
            <Nav.Link>Feature 3</Nav.Link>
            { props.loggedIn? <Button className='mx-2' variant='light' onClick={props.logout}>Logout</Button> :""}
          <Navbar.Brand href="#home">Thesis Managment</Navbar.Brand>
          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link>Signed in as: User Name</Nav.Link>
            </Nav.Item>
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link>Login <i className="bi bi-person"></i></Nav.Link>
              <Nav.Link>Logout <i className="bi bi-box-arrow-left"></i></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
    
}

export { Navigation };
