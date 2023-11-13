import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import API from "../API";
import { Container, Col, Row,Table } from "react-bootstrap";

function BrowseProposal (props){
  const [data, setData] = useState([]);
  const fetchData = async () =>{
    const result = await API.getProposals();
    setData(result.proposalSummary);
  }
  useEffect(() => {
    fetchData();
  }, []);
    
  return (
    <Container>
    <Table striped>
    <thead>
      <tr>
        <th>Title</th>
        <th>Expiration</th>
        <th>Level</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
    {data.map((proposalSummary, index) => (
        <tr>
          <td>{proposalSummary.thesis_title}</td>
          <td>{proposalSummary.thesis_expiration}</td>
          <td>{proposalSummary.thesis_level}</td>
          <td>{proposalSummary.thesis_type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  </Container>
  )
}


export default BrowseProposal;