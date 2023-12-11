import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Button,Container, Table } from "react-bootstrap";
import { Navigation } from "./Navigation";
import { useNavigate} from "react-router-dom";
import dayjs from 'dayjs'
import "../styles/BrowseProposal.css";
import API from '../API';
import useNotification from '../hooks/useNotifcation';
import "react-toastify/dist/ReactToastify.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRotateRight, faBoxArchive} from "@fortawesome/free-solid-svg-icons";
import {ToastContainer} from "react-toastify";

function BrowseProposal(props) {
    
    const [activeProposals, setActiveProposals] = useState(null);

    useEffect(() => {
        if (props.proposalList != null) {
            setActiveProposals(props.proposalList.active);
        }
    }, [props.proposalList]);

    return (
        <>
            <ToastContainer/>
            <Container>
                <ProposalTable
                    proposalList={activeProposals}
                    user={props.user}
                    
                    setProposalDirty={props.setProposalDirty}
                />
            </Container>
        </>
    );
}

function ProposalTable(props) {
    const navigate = useNavigate();
    const notify = useNotification();
    const proposalList = props.proposalList;
    const [selectedProposal, setSelectedProposal] = useState(null);

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
                 <Button onClick={() => handleCopyClick(result)} title="Create proposal starting from this one">
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

export default BrowseProposal;