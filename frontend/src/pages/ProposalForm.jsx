import {useState, useEffect} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from "./Navigation";
import API from '../API';
import useNotification from '../hooks/useNotifcation';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import "/src/index.css";
import ConfirmModal from '../components/ConfirmModal';
import "../styles/form.css"



const ProposalForm = (props) => {

    // useNavigate hook to change page
    const navigate = useNavigate();
    const location = useLocation();
    const notify=useNotification();

    const { loggedIn, user, proposalsDirty, setProposalsDirty } = props;
    const isEditing = !!(location.state?.action == "update");

    // Form fields
    const [title, setTitle]                 = useState(location.state?.proposal ? location.state.proposal.title : '');
    const [supervisor, setSupervisor]       = useState(user !== null ? user.email : ''); // this should be taken from the logged in user
    const [co_supervisor, setCoSupervisor]  = useState(location.state?.proposal ? location.state.proposal.co_supervisor.join(",") : '');
    const [type, setType]                   = useState(location.state?.proposal ? location.state.proposal.type : '');
    const [expiration, setExpirationDate]   = useState(location.state?.proposal ? dayjs(location.state.proposal.expiration).format("YYYY-MM-DD") : '');
    const [level, setLevel]                 = useState(location.state?.proposal ? location.state.proposal.level : 0);
    const [groups, setGroups]               = useState(location.state?.proposal ? location.state.proposal.groups.join(",") : '');
    const [keywords, setKeywords]           = useState(location.state?.proposal ? location.state.proposal.keywords.join(",") : "");
    const [description, setDescription]     = useState(location.state?.proposal ? location.state.proposal.description : '');
    const [required_knowledge, setRequiredKnowledge] = useState(location.state?.proposal ? location.state.proposal.required_knowledge.join(",") : '');
    const [notes, setNotes]                          = useState(location.state?.proposal ? location.state.proposal.notes : '');
    const [programmes, setPrograms]                  = useState(location.state?.proposal ? location.state.proposal.programmes.join(",") : '');
    const [submitted,setSubmitted]                    = useState(false);
    const [timeoutHandle, setTimeoutHandle] = useState(null);
    const nextpage = location.state?.nextpage || '/';

    const addProposal = (proposal) => {
      API.addProposal(proposal)
      .then(response => { setProposalsDirty(true);})
      .catch(e => { console.log(e);})
    }

    useEffect(() => {
        if (!loggedIn || !user || user.role !== 'teacher') {
            navigate(nextpage);
        }

    }, [loggedIn])
    

    const updateProposal = (updatedProposalData) => {
      // Implement the logic to update the existing proposal
      // You may need to call a different API method or handle the update in a specific way
      const existingProposal = location.state.proposal;
      if (existingProposal && existingProposal.id) {
        // Merge the existing proposal data with the updated data
        const updatedProposal = {
          ...existingProposal,
          ...updatedProposalData,
      };

      API.updateProposal(updatedProposal)
        .then((response) => {
          setProposalsDirty(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }};

    // confirmation modal before the submission
    const handleModalSubmit = (event)=>{
      event.preventDefault();
      setShowModal(true);
    }

    // handles the confirmed submit
    const handleSubmit = () => {
        
      setSubmitted(true);
      const keywords_array = keywords.split(/[,;]/).map((k) => k.trim());
      const required_knowledge_array = required_knowledge.split(/[,;]/).map((k) => k.trim());
      const programmes_array = programmes.split(/[,;]/).map((k) => k.trim());
      const groups_array = groups.split(/[,;]/).map((k) => k.trim());
      const co_supervisor_array = co_supervisor.split(/[,;]/).map((k) => k.trim());


      //chiamata API
      API.retrieveCoSupervisorsGroups(co_supervisor_array)
      .then((groups) => {
        let groups_array = [...groups, props.teacherDetail?.group_name];
        groups_array = groups_array.filter((item, index) => groups_array.indexOf(item) == index).filter((n) => n!="");
        const proposal = {
          "title":            title.trim(),
          "supervisor":       supervisor,
          "co_supervisor":    co_supervisor_array,
          "type":             type,
          "expiration":       expiration,
          "level":            level,
          "groups":           groups_array,
          "keywords":         keywords_array,
          "description":      description.trim(),
          "required_knowledge": required_knowledge_array,
          "notes":            notes.trim(),
          "programmes": programmes_array,
          "teacher_id": "1",
        };
           if (isEditing) {
        updateProposal(proposal);
      } else {
          // copying the proposal with a new insert 
          addProposal(proposal);
      }
        notify.success('Successfully submitted your proposal!');
        
        const handle = setTimeout(()=>{ navigate(nextpage) }, 3400);
        setTimeoutHandle(handle);
      })
      .catch((e) => console.log(e));

      //navigate(nextpage);
    }

    const handleGoBack = () => {
        if(timeoutHandle) clearTimeout(timeoutHandle);
        setTimeoutHandle(null);
        navigate(nextpage);
    }
    
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <>
            <ToastContainer/>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>

            <div className="my-3 text-center fw-bold fs-1">
              <h1>{isEditing ? 'Update Proposal' : 'Insert a New Proposal'}</h1>
            </div>

            <ConfirmModal 
                title = {isEditing ? "Do you want to save changes?" : "Do you want to submit the proposal?"}
                text  = {isEditing ? "The selected proposal will be updated with the new values." : "The proposal will be submitted and will be visible to the students."}
                show={showModal} setShow={setShowModal} 
                onConfirm={()=>handleSubmit()}
            />

            <Form className="block-example rounded mb-1 form-padding mt-5" onSubmit={handleModalSubmit}>
              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Title <span style={{ color: '#EF7B00' }}>*</span> </Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} 
                            className={title ? 'has-value' : 'no-value'}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Expiration Date <span style={{ color: '#EF7B00' }}>*</span></Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="date" required={true} value={expiration} onChange={event => setExpirationDate(event.target.value)} 
                            className={expiration ? 'has-value' : 'no-value'}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Supervisor</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="email" readOnly required={true} defaultValue={supervisor} disabled/>
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Level <span style={{ color: '#EF7B00' }}>*</span> </Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            as="select"
                            type="number"
                            required={true}
                            value={level}
                            onChange={(event) => setLevel(parseInt(event.target.value, 10))}
                            className={level ? 'has-value' : 'no-value'}>
                            <option value="" style={{ fontSize: '12px', color: 'gray' }} >
                            Choose the Level of the proposal
                            </option>
                            <option value= "1">Bachelor Thesis</option>
                            <option value="2" >Master Thesis</option>
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Co-Supervisors</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={false} value={co_supervisor} onChange={event => setCoSupervisor(event.target.value)} 
                            className={co_supervisor ? 'has-value' : 'no-value'}
                          /> 
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Group</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={false} value={props.teacherDetail?.group_name} disabled/>
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Type <span style={{ color: '#EF7B00' }}>*</span></Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={type} onChange={event => setType(event.target.value)} 
                            className={type ? 'has-value' : 'no-value'}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                     <Row className="d-flex justify-content-start align-items-center">
                      <Col xs={12} md={2} className="text-md-end">
                        <Form.Label>Keywords <span style={{ color: '#EF7B00' }}>*</span></Form.Label>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Control type="text" required={true} value={keywords} onChange={event => setKeywords(event.target.value)} 
                          className={keywords ? 'has-value' : 'no-value'}
                        />
                      </Col>
                     </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>CdS/Programs </Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={2} required={false} value={programmes} onChange={event => setPrograms(event.target.value)} 
                        className={programmes ? 'has-value' : 'no-value'}
                      />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Description <span style={{ color: '#EF7B00' }}>*</span> </Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={true} value={description} onChange={(event) => setDescription(event.target.value)} 
                        className={description ? 'has-value' : 'no-value'}
                      />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                     <Form.Label>Required Knowledge</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                     <Form.Control as="textarea" rows={3} value={required_knowledge} onChange={event => setRequiredKnowledge(event.target.value)} 
                      className={required_knowledge ? 'has-value' : 'no-value'}
                     />
                    </Col>
                  </Row>
              </Form.Group>
            
              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={false} value={notes} onChange={event => setNotes(event.target.value)} 
                        className={notes ? 'has-value' : 'no-value'}
                      />
                    </Col>
                  </Row>
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button className="m-2" variant="success" type="submit" disabled={submitted}>{isEditing ? 'Update' : 'Insert'}</Button>&nbsp;  
                <Button className="btn-danger m-2" onClick={handleGoBack}>Go Back</Button>
              </div>
 
            </Form>
        </>
    )
    
}

export default ProposalForm;