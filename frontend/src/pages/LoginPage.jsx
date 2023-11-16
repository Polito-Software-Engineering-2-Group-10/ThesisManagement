import { useState } from "react";
import { Button, Col, Container, Form, Row,Alert } from "react-bootstrap";
import { Navigation } from "./Navigation";
import { useNavigate} from "react-router-dom";
import API from "../API";
function LoginPage(props){
    const [email, setEmail] = useState('ferrero.renato@polito.it');
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
        
        if(valid)
        {
          
          doLogIn(credentials);
        } else {
          
          if(email==='')
          setErrorMessage('The userame field cannot be empty')
          if(password==='')
          setErrorMessage('The password field cannot be empty')
        }
        
    };

    const doLogIn = (credentials) => {
        API.logIn(credentials)
          .then( user => {
            setErrorMessage('');
            props.loginSuccessful(user);
            
          })
          .catch(err => {
           
            setErrorMessage('Incorrect email or passord');
          })
      }


    return(
        <>
            {/*<Navigation logout={props.logout} loggedIn={props.loggedIn}/>*/}
            <Container style={{paddingTop: "50px"}}>
            <Row>
                <Col xs={3}></Col>
                <Col xs={6}>
                    <h1>Welcome to thesis Management</h1>
                    <h2>Log in to be able to use the services dedicated to you</h2>
                    <Form onSubmit={handleSubmit}>
                        {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={email} onChange={ev => setEmail(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <Button className='my-2' variant='info' type='submit'>Login</Button>
                        <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                    </Form>
                </Col>
                <Col xs={3}></Col>
            </Row>
        </Container>
        </>
    )
}

export default LoginPage;
