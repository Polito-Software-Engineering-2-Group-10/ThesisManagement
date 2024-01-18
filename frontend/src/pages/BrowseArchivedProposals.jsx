import {useEffect, useState} from "react";
import {Button, Container ,Accordion} from "react-bootstrap";
import API from '../API';
import useNotification from '../hooks/useNotification';
import {Navigation} from "./Navigation.jsx";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons';
import {ToastContainer} from "react-toastify";
import "../styles/BrowseArchivedProposal.css";
import { AccordionElement } from '../components/AccordionElement.jsx';
import dayjs from 'dayjs';

import ConfirmModal from '../components/ConfirmModal';

function BrowseArchivedProposals(props) {
    const {setProposalsDirty, proposalsList, loggedIn, logOut, user} = props;

    const [archivedProposals, setArchivedProposals] = useState(null);

    useEffect(() => {
        if(proposalsList != null) {
            setArchivedProposals(proposalsList.archived);
        }
    }, [proposalsList]);

    return (
        <>
            <Navigation
                logout={logOut}
                loggedIn={loggedIn}
                user={user}
            />
            <ToastContainer/>
            <Container>
                <ProposalTable
                    archivedProposals={archivedProposals}
                    user={user}
                    setProposalsDirty={setProposalsDirty}
                />
            </Container>
        </>
    );
}

function ProposalTable(props) {
    const {archivedProposals, user, setProposalsDirty} = props;
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const notify = useNotification();

    const [selectedProposal, setSelectedProposal] = useState(null);
    const [filteredList, setFilteredList] = useState(null);
    const [query, setQuery] = useState('t');

    const keys = ['title', 'expiration', 'type', 'levelName'];

    useEffect(() => {
        if(archivedProposals) {
            archivedProposals.map((elem) => {
                if (elem.level == 1) {
                    elem['levelName'] = 'Bachelor';
                }
                else {
                    elem['levelName'] = 'Master';
                }
                return elem;
            } )
            setFilteredList(archivedProposals.filter((item) => {
                return keys.some((key) => {
                    if (key === 'expiration') {
                        return dayjs(item[key]).format('DD/MM/YYYY').toString().toLowerCase().includes(query.toLowerCase())
                    } else{
                        return item[key].toLowerCase().includes(query.toLowerCase())
                    }
                });
            } ))
        }
    }, [query, archivedProposals]);

    const handleUnarchiveClick = (proposal) => {
        API.archiveProposal(proposal.id).then(() => {
            setProposalsDirty(true);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleCopyClick = (proposal) => {
        navigate('/insert', {state: {proposal: proposal, action: "copy"} });
    }

    const handleUpdateClick = (proposal) => {
        navigate(`/updateProposal/${proposal.id}`, {state: {proposal: proposal, action: "update"} });
    }

    const handleDeleteClick = (proposal) => {
        setShowModal(true);
        setSelectedProposal(proposal);
    }

    const deleteProposal = (proposal) => {
        const mailInfo=
            {
                teacher_name: user.name,
                teacher_surname: user.surname,
                thesis_title: proposal.title
            }
        API.deleteProposal(proposal.id,mailInfo).then(( {data, status} )=> {
            setProposalsDirty(true);
            if(status == 400) {
                notify.error("You can't delete this proposal because it already has an accepted application!");
            }
            else {
                if(status == 200) {
                    notify.success("Proposal deleted successfully!");
                }
                else {
                    notify.error(data.error);
                }
            }
        })
        .catch((err)=> {
            notify.error(err);
            console.log(err);
        });
    }

    const handleViewActiveClick = () => {
        navigate('/');
    };

    return (
        <Container className="proposal-table">
            <ConfirmModal 
                title = {"Do you want to delete the proposal?"}
                text  = {"The selected proposal will be permanently removed."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>deleteProposal(selectedProposal)}
            />

            <div id="search-archived">
                <div id="search-div">
                    <i className="bi bi-search" style={ {marginRight: '10px'} }></i>
                    <input
                        type='text'
                        placeholder=' Search...'
                        className='search'
                        onChange={(e)=>setQuery(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={handleViewActiveClick}
                    variant="outline-dark"
                    className="view-active-btn"
                >
                    <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-2 " style={ {marginRight: '8px'} } />
                    <span>View Active Proposals</span>
                </Button>
            </div>
            <h3 className="archived-title">
                Archived Proposals
            </h3>
        
            <Accordion>
                { filteredList?.length > 0 ? filteredList?.map((result, index) => {
                    return (
                        <AccordionElement
                            title={result.title}
                            expiration={result.expiration}
                            level={result.level === 1 ? "Bachelor" : "Master"}
                            type={result.type}
                            key={index}
                            id={result.id}
                            actions={{
                                "edit": ()      => handleUpdateClick(result),
                                "copy": ()      => handleCopyClick(result),
                                "unarchive": () => handleUnarchiveClick(result),
                                "delete": ()    => handleDeleteClick(result)
                            }}
                        />
                )}) : <p className="center-text">No archived proposals</p>
                }
            </Accordion>

        </Container>
    );
}

export default BrowseArchivedProposals;
