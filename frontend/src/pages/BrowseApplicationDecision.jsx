import {Container, Button, Col, Row, Table} from "react-bootstrap"
import dayjs from 'dayjs'
import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";



function BrowseAppDecision(props){

    const navigate = useNavigate();

    return(
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            
            { props.appList ? 
                <>
                    <Table style={{width: '70%', margin: '0 auto', marginTop: "40px"}}>
                        <thead>
                            <tr>
                                <th>Thesis Title</th>
                                <th>Application Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.appList.map((a) => {
                                    return(
                                        <tr key={a.id}>
                                            <td>{a.thesis_title}</td>
                                            <td>{dayjs(a.apply_date).format('DD/MM/YYYY')}</td>
                                            <td>{a.status === null ? 'Processing': (
                                                a.status ? 'Accepted' : 'Rejected'
                                            )}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <Container style={{marginTop: "30px"}}>
                        <Row>
                            <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}><Button variant="success" onClick={() => navigate('/')}>New Apply</Button></Col>
                            {/* <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}}><Button variant="danger"  onClick={() => navigate('/')}>Back</Button></Col> */}
                        </Row>
                    </Container>                    
                </>
            : ''}
        </>
    )
}

export default BrowseAppDecision;