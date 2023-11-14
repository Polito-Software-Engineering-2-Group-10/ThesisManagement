import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import API from "../API";
import { Button,Container, Col, Row,Table } from "react-bootstrap";
import { Navigation } from "./Navigation";
import { useNavigate} from "react-router-dom";
import dayjs from 'dayjs'

function BrowseProposal (props){
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const fetchData = async () =>{
    const result = await API.getProposals();
    setData(result);
  }
  useEffect(() => {
    fetchData();
  }, []);
    
  return (
    <>
    <Navigation logout={props.logout} loggedIn={props.loggedIn}/>
    <Container>
      <h3>Teacher ID: </h3>
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
          <td>{dayjs(result.thesis_expiration).format('DD/MM/YYYY')}</td>
          <td>{result.thesis_level}</td>
          <td>{result.thesis_type}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  <Button className='my-2'  variant='info' onClick={()=>navigate('/')}>Back</Button>
  </Container>
  </>
  )
}


export default BrowseProposal;