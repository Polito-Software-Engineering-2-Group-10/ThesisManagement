import {Navbar, Nav,Container,Button} from 'react-bootstrap';



function Navigation(props) {

    return (
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>Feature 1</Nav.Link>
            <Nav.Link>Feature 2</Nav.Link>
            <Nav.Link>Feature 3</Nav.Link>
            { props.loggedIn? <Button className='mx-2' variant='light' onClick={props.logout}>Logout</Button> :""}
          </Nav>
        </Container>
      </Navbar>
    )
    
}

export { Navigation };
