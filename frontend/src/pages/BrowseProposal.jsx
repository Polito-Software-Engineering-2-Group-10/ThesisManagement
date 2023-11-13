import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import API from "../API";
import { Container, Col, Row,Table } from "react-bootstrap";

function BrowseProposal (props){
  const [data, setData] = useState([]);
  const fetchData = async () =>{
    const result = await API.getProposals();
    setData(result);
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
    {data.map((result, index) => (
        <tr>
          <td>{result.thesis_title}</td>
          <td>{result.thesis_expiration}</td>
          <td>{result.thesis_level}</td>
          <td>{result.thesis_type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  </Container>
  )
}


export default BrowseProposal;