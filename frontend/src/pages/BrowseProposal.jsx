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
import { AccordionElement } from '../components/AccordionElement';

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
                                    <AccordionElement
                                        key={index}
                                        id = {proposal.id}
                                        title={proposal.title} 
                                        expiration={proposal.expiration}
                                        level={proposal.level}
                                        type={proposal.type}
                                        description={proposal.description}
                                        supervisor={proposal.supervisor}
                                        coSupervisor={proposal.co_supervisor}
                                        actions={{
                                            view: `/applyToProp/${proposal.id}`
                                        }}
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

    return (
        <div className="proposal-table">
            <ConfirmModal 
                title = {"Do you want to delete the proposal?"}
                text  = {"The selected proposal will be permanently removed."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>deleteProposal(selectedProposal)}
            />

            <Button
                onClick={handleViewArchivedClick}
                variant="outline-dark"
                className="archived-btn"
                id='view-archived-proposals'
            >
                <FontAwesomeIcon icon={faBoxArchive} className="mr-2" style={{ marginRight: '8px' }} />
            <span>View Archived Proposals</span>
            </Button>

            <h3 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }} className="center-text">
                Active Proposals
            </h3>
        
            <Accordion>
                {proposalList?.length > 0 ? proposalList.map((proposal, index) => {
                    return (
                        <AccordionElement 
                            key={index}
                            id = {proposal.id}
                            title={proposal.title} 
                            expiration={proposal.expiration}
                            level={proposal.level}
                            type={proposal.type}
                        
                            actions={{
                                "copy": ()      => handleCopyClick(proposal),
                                "edit": ()      => handleUpdateClick(proposal),
                                "archive": ()   => handleArchiveClick(proposal),
                                "delete": ()    => handleDeleteClick(proposal)
                            }}
                        />
                    );
                }) : <p className="center-text">No active proposals</p>}
                
            </Accordion>
      
            
        
        </div>
    );
}



export default BrowseProposal;