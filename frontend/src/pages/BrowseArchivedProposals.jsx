import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import dayjs from 'dayjs';
import API from '../API';
import useNotification from '../hooks/useNotifcation';
import {Navigation} from "./Navigation.jsx";
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {ToastContainer} from "react-toastify";

function BrowseArchivedProposals(props) {
    const [archivedProposals, setArchivedProposals] = useState(null);

    useEffect(() => {
        if (props.proposalList != null) {
            setArchivedProposals(props.proposalList.archived);
        }
    }, [props.proposalList]);

    return (
        <>
            <Navigation
                logout={props.logout}
                loggedIn={props.loggedIn}
                user={props.user}
            />
            <ToastContainer/>
            <Container>
                <ProposalTable
                    proposalList={archivedProposals}
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

    const handleUnarchiveClick = (proposal) => {
        API.archiveProposal(proposal.id).then(() => {
            props.setProposalDirty(true);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleCopyClick = (proposal) => {
        navigate('/insert', {state: {proposal: proposal, action: "copy"}});
    }

    const handleUpdateClick = (proposal) => {
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
                notify.success("Proposal deleted succesfully");
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

    const handleBackToMainClick = () => {
        navigate('/*');
    };

    const handleViewActiveClick = () => {
        navigate('/proposal');
    };

    const generateRow = (result) => {
        return (
            <tr key={result.id} style={{ textAlign: 'center' }} onClick={() => handleProposalClick(result)}
                className={selectedProposal && selectedProposal.id === result.id ? 'table-primary' : ''}
            >
            <td>{result.title}</td>
            <td>{dayjs(result.expiration).format('DD/MM/YYYY')}</td>
            <td>{result.level === 1 ? "Bachelor" : "Master"}</td>
            <td>{result.type}</td>
            <td className="d-flex justify-content-center align-items-center">
                <Button className="btn-edit" title="Update proposal" onClick={() => handleUpdateClick(result)}>
                    <i className="bi bi-pencil-square"></i>
                </Button>
                <Button onClick={() => handleCopyClick(result)} title="Create proposal starting from this one">
                    <i className="bi bi-copy"></i>
                </Button>
                <Button className="btn-archive" onClick={() => handleUnarchiveClick(result)} title="Unarchive proposal">
                    <i className="bi bi-archive"></i>
                </Button>
                <Button className="btn-delete" onClick={() => handleDeleteClick(result)} title="Delete proposal">
                    <i className="bi bi-trash"></i>
                </Button>
            </td>
            </tr>
        );
    };

    return (
        <>
            <Container className="proposal-table">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                        onClick={handleBackToMainClick}
                        variant="outline-dark"
                        className="d-flex align-items-center"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" style={{ marginRight: '8px' }} />
                        <span>Back to main page</span>
                    </Button>
                    <Button
                        onClick={handleViewActiveClick}
                        variant="outline-dark"
                        className="d-flex align-items-center"
                    >
                        <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-2" style={{ marginRight: '8px' }} />
                        <span>View Active Proposals</span>
                    </Button>
                </div>
                <h3 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px' }} className="center-text">
                    Archived Proposals
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
                        {proposalList && proposalList.map((result, index) => generateRow(result))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

export default BrowseArchivedProposals;
