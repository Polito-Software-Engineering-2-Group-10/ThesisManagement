import {useState, useEffect} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from "./Navigation";
import API from '../API';



const ProposalForm = (props) => {
  const { loggedIn, user, proposalsDirty, setProposalsDirty } = props;
  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [supervisor, setSupervisor] = useState(user !== null ? user.email : ''); // this should be taken from the logged in user
  const [co_supervisor, setCoSupervisor] = useState(props.page ? props.page.co_supervisor : []);
  const [type, setType] = useState(props.page ? props.page.type : '');
  const [expiration, setExpirationDate] = useState(props.page ? props.page.expiration : '');
  const [level, setLevel] = useState();
  const [groups, setGroups] = useState(props.page ? props.page.groups : []);
  const [keywords, setKeywords] = useState(props.page ? props.page.keywords : []);
  const [description, setDescription] = useState(props.page ? props.page.description : '');
  const [required_knowledge, setRequiredKnowledge] = useState(props.page ? props.page.required_knowledge : []);
  const [notes, setNotes] = useState(props.page ? props.page.notes : '');
  const [programmes, setPrograms] = useState(props.page ? props.page.programmes : []);
  

    // useNavigate hook to change page
    const navigate = useNavigate();
    const location = useLocation();
    
    
    const nextpage = location.state?.nextpage || '/';

    const addProposal = (proposal) => {
      API.addProposal(proposal)
      .then(response => {
        setProposalsDirty(true);
      })
        .catch(e => {
          console.log(e);
        })
    }

    useEffect(() => {
        if (!loggedIn || !user || user.role !== 'teacher') {
            navigate(nextpage);
        }

    }, [loggedIn])

    const handleSubmit = (event) => {
      event.preventDefault();

      const keywords_array = keywords.split(/[,;]/).map((k) => k.trim());
      const required_knowledge_array = required_knowledge.split(/[,;]/).map((k) => k.trim());
      const programmes_array = required_knowledge.split(/[,;]/).map((k) => k.trim());
      const groups_array = required_knowledge.split(/[,;]/).map((k) => k.trim());
      const co_supervisor_array = required_knowledge.split(/[,;]/).map((k) => k.trim());

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

      addProposal(proposal);
      navigate(nextpage);
    }


    return (
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>

            <div className="my-3 text-center fw-bold fs-1">
              <p>Insert a New Proposal</p>
            </div>

            <Form className="block-example rounded mb-1 form-padding mt-5" onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-end align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Title</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Expiration Date</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="date" required={true} value={expiration} onChange={event => setExpirationDate(event.target.value) } />
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
                          <Form.Control type="email" readOnly required={true} defaultValue={supervisor} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Level</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            as="select"
                            type="number"
                            required={true}
                            value={level}
                            onChange={(event) => setLevel(parseInt(event.target.value, 10))}
                            style={{ backgroundColor: level ? 'white' : 'azure' }}>
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
                          <Form.Control type="text" required={false} value={co_supervisor} onChange={event => setCoSupervisor(event.target.value)} /> 
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Row className="d-flex justify-content-start align-items-center">
                        <Col xs={12} md={2} className="text-md-end">
                          <Form.Label>Groups</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={false} value={groups} onChange={event => setGroups(event.target.value)} />
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
                          <Form.Label>Type</Form.Label>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Control type="text" required={true} value={type} onChange={event => setType(event.target.value)} />
                        </Col>
                      </Row>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                     <Row className="d-flex justify-content-start align-items-center">
                      <Col xs={12} md={2} className="text-md-end">
                        <Form.Label>Keywords</Form.Label>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Control type="text" required={true} value={keywords} onChange={event => setKeywords(event.target.value)} />
                      </Col>
                     </Row>
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>CdS/Programs</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={2} required={false} value={programmes} onChange={event => setPrograms(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Description</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={true} value={description} onChange={(event) => setDescription(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                     <Form.Label>Required Knowledge</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                     <Form.Control as="textarea" rows={3} required={true} value={required_knowledge} onChange={event => setRequiredKnowledge(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>
            
              <Form.Group className="mb-3">
                  <Row className="d-flex justify-content-start align-items-center">
                    <Col xs={12} md={3} className="text-md-end">
                      <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Control as="textarea" rows={3} required={false} value={notes} onChange={event => setNotes(event.target.value)} />
                    </Col>
                  </Row>
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button className="m-2" variant="success" type="submit">Insert</Button>&nbsp;  
                <Link className="btn btn-danger m-2"  to={nextpage}>Go Back</Link>
              </div>
 
            </Form>
        </>
    )
    
}

export default ProposalForm;