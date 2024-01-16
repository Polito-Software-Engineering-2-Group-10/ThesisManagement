import { useState } from "react";
import { Button, Col, Container, Form, Row,Alert,Card } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import API from "../API";
import "../styles/LoginPage.css";
import logoBlu from "../img/LogoBlu.svg";
import { faDisplay } from "@fortawesome/free-solid-svg-icons";

function LoginPage(props){
    const [email, setEmail] = useState('ferrero.renato@tmtest.polito.it');
    const [password, setPassword] = useState('2');
    const [errorMessage, setErrorMessage] = useState('') ;
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { email, password };
        
        let valid = true;
        if(email === '' || password === '')
            valid = false;
        
        if(valid){
          doLogIn(credentials);
        }
        else {
          if(email==='')    setErrorMessage('The username field cannot be empty');
          if(password==='') setErrorMessage('The password field cannot be empty');
        }
        
    };

    const doLogIn = (credentials) => {
        API.logIn(credentials)
          .then( user => {
            setErrorMessage('');
            props.loginSuccessful(user);
            
          })
          .catch(err => {
            setErrorMessage('Incorrect email or password');
          })
      }


    return(
        <>
            {/*<Navigation logout={props.logout} loggedIn={props.loggedIn}/>*/}
            <Container style={{paddingTop: "50px"}}>
            <Row>
                <Col xs={3}>
                
                </Col>
                    
                
                <Col xs={6}>
                <h1 className="title">Welcome to Thesis Management</h1>
                <Card style={{padding: "25px"}}>
                <div className="text-center">   
                    
                    
                    <img 
                    width="260"
                    height="115"
                    className="d-inline-block align-center"
                    align="center"
                    src={logoBlu} />
                    </div>
                    
                    
                    <Form onSubmit={handleSubmit}>
                        {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
                        <Form.Group controlId='email' >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={email} onChange={ev => setEmail(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <Container>
                            <div align="center">
                                <Button className='my-2 buttons' type='submit'>Login</Button>
                                
                                <Button className='my-2 mx-2 buttons3' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                            </div>    
                            <div id="login-button-divider">
                                <div className="login-separate"></div>
                                <div className="login-separate-text">or</div>
                                <div className="login-separate"></div>
                                  
                                
                            </div>
                            <div  align="center">
                                <Button className='my-2 mx-2 buttons2' onClick={() => API.logInWithSaml() }>SAML Login</Button>
                            </div>                     
                        </Container>
                    </Form>
        
                    </Card>
                </Col>
                
                <Col xs={3}></Col>
            </Row>
        </Container>
        </>
    )
}

export default LoginPage;
