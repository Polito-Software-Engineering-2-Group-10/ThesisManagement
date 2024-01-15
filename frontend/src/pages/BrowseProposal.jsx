import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Button,Container, Table } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import dayjs from 'dayjs'
import "../styles/BrowseProposal.css";
import API from '../API';
import useNotification from '../hooks/useNotifcation';
import "react-toastify/dist/ReactToastify.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxArchive} from "@fortawesome/free-solid-svg-icons";
import {ToastContainer} from "react-toastify";
import ConfirmModal from '../components/ConfirmModal';

import {Accordion} from 'react-bootstrap';

function BrowseProposal(props) {
    const {cosupervisorProposalList} = props;   
    const [activeProposals, setActiveProposals] = useState(null);

    useEffect(() => {
        if (props.proposalList != null) {
            setActiveProposals(props.proposalList.active);
        }
    }, [props.proposalList]);

    return (
        <div className='browse-proposals'>
            <ToastContainer/>
            <Container>
                <ProposalTable
                    proposalList={activeProposals}
                    user={props.user}
                    setProposalDirty={props.setProposalDirty}
                />

                <h3 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }} className="center-text">
                    Co-Supervised Proposals
                </h3>
        
                <Accordion>
                    {cosupervisorProposalList && cosupervisorProposalList?.length > 0 ?
                        cosupervisorProposalList.map((proposal, index) => {
                            return (
                                <AccordionRow 
                                    key={index}
                                    id = {proposal.id}
                                    title={proposal.title} 
                                    expiration={proposal.expiration}
                                    level={proposal.level}
                                    type={proposal.type}
                                    description={proposal.description}
                                    co_supervisor={proposal.co_supervisor}
                                    supervisor={proposal.supervisor}
                                />
                            );
                        }
                    ) : <p className="center-text">No co-supervised proposals</p>
                }</Accordion>
            </Container>
        </div>
    );
}

function ProposalTable(props) {
    const navigate = useNavigate();
    const notify = useNotification();
    const proposalList = props.proposalList;
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleProposalClick = (proposal) => {
        setSelectedProposal(proposal);
    };

    const handleCopyClick = (proposal) => {
        // navigate to insert proposal page with the proposal as a parameter
        navigate('/insert', {state: {proposal: proposal, action: "copy"}});
    }

    const handleUpdateClick = (proposal) => {
        // navigate to insert proposal page with the proposal as a parameter
        navigate(`/updateProposal/${proposal.id}`, {state: {proposal: proposal, action: "update"}});
    }
    
    const handleDeleteClick = (proposal) => {
        setShowModal(true);
        setSelectedProposal(proposal);
    }

    const deleteProposal = (proposal) => {
        const mailInfo=
        {
            teacher_name:props.user.name,
            teacher_surname:props.user.surname,
            thesis_title:proposal.title
        }
        API.deleteProposal(proposal.id,mailInfo).then(({ data, status })=>{
            props.setProposalDirty(true);
            if (status == 400)
            {
                notify.error("You can't delete this proposal because already has accepted application");
            }
            else if (status == 200) {
                notify.success("Proposal deleted successfully");
            }
            else {
                notify.error(data.error);
            }
        })
        .catch((err)=>{
            notify.error(err);
            console.log(err)
        });
    }

    const handleArchiveClick = (proposal) => {
        API.archiveProposal(proposal.id).then(()=>{
            
            props.setProposalDirty(true);
        })
        .catch((err)=>{console.log(err)});
    }

    const handleViewArchivedClick = () => {
        navigate('/archivedProposals');
    };

    const handleBackToMainClick = () => {
        navigate('/*');
    };

    const generateRow = (result) => {
        return(
        <tr key={result.id} style={{ textAlign: 'center' }} onClick={() => handleProposalClick(result)}
            className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
        >
        <td>{result.title}</td>
        <td>{dayjs(result.expiration).format('DD/MM/YYYY')}</td>
        <td>{result.level==1 ? "Bachelor" : "Master"}</td>
        <td>{result.type}</td>
            <td className="d-flex justify-content-center align-items-center">
                 <Button className="btn-edit" title="Update proposal" onClick={() => handleUpdateClick(result)}>
                     <i className="bi bi-pencil-square"></i>
                 </Button>
                 <Button className="btn-copy" onClick={() => handleCopyClick(result)} title="Create proposal starting from this one">
                     <i className="bi bi-copy"></i>
                 </Button>
                 <Button className="btn-archive" onClick={() => handleArchiveClick(result)} title="Archive proposal">
                     <i className="bi bi-archive"></i>
                 </Button>
                 <Button className="btn-delete" onClick={() => handleDeleteClick(result)} title="Delete proposal">
                     <i className="bi bi-trash"></i>
                 </Button>
             </td>
        </tr>
        )
    }

    return (
        <Container className="proposal-table">
        
            <ConfirmModal 
                title = {"Do you want to delete the proposal?"}
                text  = {"The selected proposal will be permanently removed."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>deleteProposal(selectedProposal)}
            />
        
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                    onClick={handleViewArchivedClick}
                    variant="outline-dark"
                    className="d-flex align-items-center archived-btn"
                    id='view-archived-proposals'
                >
                    <FontAwesomeIcon icon={faBoxArchive} className="mr-2" style={{ marginRight: '8px' }} />
                    <span>View Archived Proposals</span>
                </Button>

            </div>
            <h3 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }} className="center-text">
                Active Proposals
            </h3>
            <Table hover bordered responsive>
                <thead style={{ textAlign: 'center' }}>
                <tr>
                    <th>Title</th>
                    <th>Expiration</th>
                    <th>Level</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {proposalList && proposalList.map((result, index) =>
                    generateRow(result)
                )}
                </tbody>
            </Table>
        
            
        
        </Container>
    );
}

// component to display the accordion
const AccordionRow = (props) => {
    const {id, title, description, supervisor, co_supervisor, expiration, level, type} = props; 

    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            <p><b>Supervisor: </b>{supervisor}</p>
            <p><b>Co-Supervisors: </b>{co_supervisor.join(", ")}</p>
            <p><b>Expiration:     </b>{expiration}</p>
            <p><b>Level:          </b>{level}</p>
            <p><b>Type:           </b>{type}</p>

            <div className="accordion-row-buttons">
                <Button variant="primary" className='btn-view' onClick={()=>{}}>
                     <i className="bi bi-file-earmark-fill"></i>
                    View
                </Button>
            </div>
        </Accordion.Body>
      </Accordion.Item>
    ) 
}

export default BrowseProposal;