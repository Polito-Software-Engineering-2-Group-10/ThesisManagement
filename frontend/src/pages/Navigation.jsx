import {Navbar, Nav} from 'react-bootstrap';
import {Container} from 'react-bootstrap';


function Navigation(props) {

    return (
      <Navbar expand="lg" bg='primary' data-bs-theme="dark">
        <Container>
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
              <Nav.Link>Logout <i class="bi bi-box-arrow-left"></i></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
    
}

export default Navigation;