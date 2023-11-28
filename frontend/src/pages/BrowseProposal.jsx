import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Button,Container, Table, Row, Col } from "react-bootstrap";
import { Navigation } from "./Navigation";
import { useNavigate} from "react-router-dom";
import dayjs from 'dayjs'
import "../styles/BrowseProposal.css";
import API from '../API';
function BrowseProposal (props){
   
    // utility to generate a table row from a proposal
    const [activeProposals, setActiveProposals] = useState(null);
    const [archivedProposals, setArchivedProposals] = useState(null);
    
    useEffect(() => {
        if (props.proposalList != null) {
            setActiveProposals(props.proposalList.active);
            setArchivedProposals(props.proposalList.archived);
        }
        
    }, [props.proposalList]);

    return (
    <>
        <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>

        <Container>
            <ProposalTable title="Active proposals" proposalList={activeProposals}      setProposalDirty={props.setProposalDirty} />
            <ProposalTable title="Archived proposals" proposalList={archivedProposals}  setProposalDirty={props.setProposalDirty} />
        </Container>
    </>
  )
}


function ProposalTable(props){
    const navigate = useNavigate();
    
    // title of the table
    let {title} = props;

    // list of proposal 
    const [proposalList, setProposalList] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    
    // update proposal list
    useEffect(() => {
        if (props.proposalList != null) {
            setProposalList(props.proposalList);
        }
    }, [props.proposalList]);
  
    // click on a proposal
    const handleProposalClick = (proposal) => {
        setSelectedProposal(proposal);
    }   

    const handleCopyClick = (proposal) => {
        // navigate to insert proposal page with the proposal as a parameter
        navigate('/insert', {state: {proposal: proposal}});
    }

    const handleUpdateClick = (proposal) => {
        // navigate to insert proposal page with the proposal as a parameter
        navigate(`/updateProposal/${proposal.id}`, {state: {proposal: proposal}});
    }

    const handleDeleteClick = (proposal) => {
        // navigate to insert proposal page with the proposal as a parameter
        API.deleteProposal(proposal.id).then(()=>{
            // setProposalList(proposalList.filter((res) => res.id != proposal.id))
            props.setProposalDirty(true);
        })
        .catch((err)=>{console.log(err)});
    }


    // generates the row for a proposal
    const generateRow = (result) => {
        return (
         <tr key={result.id} onClick={() => handleProposalClick(result)}
        className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
        >
          <td>{result.title}</td>
          <td>{dayjs(result.expiration).format('DD/MM/YYYY')}</td>
          <td>{result.level==1 ? "Bachelor" : "Master"}</td>
          <td>{result.type}</td>
          <td>
            <span style={{display: "flex"}}>
                
                <Button className="btn-edit" onClick={()=>handleUpdateClick(result)}><i className="bi bi-pencil-square"></i></Button>
                <Button onClick={()=>handleCopyClick(result)}><i className="bi bi-copy"></i></Button>
                <Button className="btn-delete" onClick={()=>handleDeleteClick(result)}><i className="bi bi-trash"></i></Button>
            </span>
          </td>
        </tr>
        )
    }

    
  
    return (
        <Container className="proposal-table">
        <Row>
            <h3 className='center-text'>{title}</h3>
        </Row>

        <Table hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Expiration</th>
            <th>Level</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
        {/* For story 7, professor should see only *active* proposals */}
        {proposalList && proposalList.map((result, index) => 
            generateRow(result)
        )}
        </tbody>
      </Table>
        {/* For story 7, professor should see only *active* proposals 
            { props.proposalList && props.proposalList.archived.map((result, index) => (<></>))}
            </tbody>
          </Table>
         */}
            {/*
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
        */}
        </Container>
    )
}


export default BrowseProposal;