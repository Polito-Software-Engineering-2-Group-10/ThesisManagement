import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import API from "../API";
import { Button,Container, Col, Row,Table } from "react-bootstrap";
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
    {props.proposalList.map((result, index) => (
        <tr key={result.id} onClick={() => handleProposalClick(result)}
        className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
        >
          <td>{result.thesis_title}</td>
          <td>{dayjs(result.thesis_expiration).format('DD/MM/YYYY')}</td>
          <td>{result.thesis_level}</td>
          <td>{result.thesis_type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  <div style={{marginRight: 1000+'em'}}>
  <Button className='my-2'  variant='success' disabled={!selectedProposal}>Modify</Button>
  </div>
  <Button className='my-2'  variant='warning' onClick={()=>navigate('/')}>Back</Button>
  </Container>
  </>
  )
}


export default BrowseProposal;