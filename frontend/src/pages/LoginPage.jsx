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
                        <div>
                            <div align="center">
                                <Button className='my-2 buttons' type='submit'>Login</Button>
                                
                                <Button className='my-2 buttons3' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                            </div>    
                            <div id="login-button-divider">
                                <div className="login-separate"></div>
                                <div className="login-separate-text">or</div>
                                <div className="login-separate"></div>
                                  
                                
                            </div>
                            <div  align="center">
                                <Button className='my-2  buttons2' onClick={() => API.logInWithSaml() }> 
                               
                                <svg width="20px" height="20px" viewBox="0 0 16 16"  
                                xmlns="http://www.w3.org/2000/svg" fill="none">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> <g fill="#C22E33"> 
                                <path d="M7.754 2l.463.41c.343.304.687.607 1.026.915C11.44 5.32 13.3 7.565 14.7 10.149c.072.132.137.268.202.403l.098.203-.108.057-.081-.115-.21-.299-.147-.214c-1.019-1.479-2.04-2.96-3.442-4.145a6.563 6.563 0 00-1.393-.904c-1.014-.485-1.916-.291-2.69.505-.736.757-1.118 1.697-1.463 2.653-.045.123-.092.245-.139.367l-.082.215-.172-.055c.1-.348.192-.698.284-1.049.21-.795.42-1.59.712-2.356.31-.816.702-1.603 1.093-2.39.169-.341.338-.682.5-1.025h.092z"></path> 
                                <path d="M8.448 11.822c-1.626.77-5.56 1.564-7.426 1.36C.717 11.576 3.71 4.05 5.18 2.91l-.095.218a4.638 4.638 0 01-.138.303l-.066.129c-.76 1.462-1.519 2.926-1.908 4.53a7.482 7.482 0 00-.228 1.689c-.01 1.34.824 2.252 2.217 2.309.67.027 1.347-.043 2.023-.114.294-.03.587-.061.88-.084.108-.008.214-.021.352-.039l.231-.028z"></path> 
                                <path d="M3.825 14.781c-.445.034-.89.068-1.333.108 4.097.39 8.03-.277 11.91-1.644-1.265-2.23-2.97-3.991-4.952-5.522.026.098.084.169.141.239l.048.06c.17.226.348.448.527.67.409.509.818 1.018 1.126 1.578.778 1.42.356 2.648-1.168 3.296-1.002.427-2.097.718-3.18.892-1.03.164-2.075.243-3.119.323z"></path> 
                                </g> 
                                </g>
                                </svg>
                                &nbsp; SAML Login &nbsp; &nbsp; &nbsp;</Button>
                            </div>  
                            
                        </div>
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
