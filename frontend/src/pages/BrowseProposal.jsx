import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button,Container, Table, Row, Col } from "react-bootstrap";
import { Navigation } from "./Navigation";
import { useNavigate} from "react-router-dom";
import dayjs from 'dayjs'

function BrowseProposal (props){
  const navigate = useNavigate();
  
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  const handleProposalClick = (proposal) => {
    setSelectedProposal(proposal);
  }

  return (
    <>
    <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
    <Container>
      {/*<h3>Teacher ID: </h3>*/}
    <Row>
        <h3 className='center-text'>Active proposals</h3>
    </Row>
    <Table hover>
    <thead>
      <tr>
        <th>Title</th>
        <th>Expiration</th>
        <th>Level</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
    {/* For story 7, professor should see only *active* proposals */}
    {props.proposalList && props.proposalList.active.map((result, index) => (
        <tr key={result.id} onClick={() => handleProposalClick(result)}
        className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
        >
          <td>{result.title}</td>
          <td>{dayjs(result.expiration).format('DD/MM/YYYY')}</td>
          <td>{result.level==1 ? "Bachelor" : "Master"}</td>
          <td>{result.type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  <Row>
        <h3 className='center-text'>Archived proposals</h3>
    </Row>
    <Table hover>
    <thead>
      <tr>
        <th>Title</th>
        <th>Expiration</th>
        <th>Level</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
    {/* For story 7, professor should see only *active* proposals */}
    {props.proposalList && props.proposalList.archived.map((result, index) => (
        <tr key={result.id} onClick={() => handleProposalClick(result)}
        className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
        >
          <td>{result.title}</td>
          <td>{dayjs(result.expiration).format('DD/MM/YYYY')}</td>
          <td>{result.level==1 ? "Bachelor" : "Master"}</td>
          <td>{result.type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  <Row>
        <Col style={{
            display: 'flex',
            justifyContent: 'flex-end'
        }}>
            <Button className='my-2'  variant='success' disabled={!selectedProposal}>Modify</Button>
        </Col>
        <Col style={{
            display: 'flex',
            justifyContent: 'flex-start'
        }}>
            <Button className='my-2'  variant='warning' onClick={()=>navigate('/')}>Back</Button>
        </Col>
  </Row>
  </Container>
  </>
  )
}


export default BrowseProposal;