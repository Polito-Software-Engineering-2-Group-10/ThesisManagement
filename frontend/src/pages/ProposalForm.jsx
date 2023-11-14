//import dayjs from 'dayjs';

import {useState, useContext, useEffect} from 'react';
import {Form, Button, Alert, Image, Row, Col} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Navigation } from "./Navigation";
import API from '../API';
// import MessageContext from '../messageCtx';



const ProposalForm = (props) => {
    const { loggedIn, user } = props;
    const [title, setTitle] = useState(props.page ? props.page.title : 'Test title');
    const [supervisor, setSupervisor] = useState(user !== null ? user.email : 'test@polito.it'); // this should be taken from the logged in user
    const [co_supervisor, setCoSupervisor] = useState(props.page ? props.page.co_supervisor : ['another.test@polito.it']);
    const [type, setType] = useState(props.page ? props.page.type : 'This is a test thesis proposal');
    const [expiration, setExpirationDate] = useState(props.page ? props.page.expiration : '2024-12-31');
    const [level, setLevel] = useState(props.page ? parseInt(props.page.level, 10) : 1);
    const [groups, setGroups] = useState(props.page ? props.page.groups : ['Test group']);
    const [keywords, setKeywords] = useState(props.page ? props.page.keywords : ['Test keyword']);
    const [description, setDescription] = useState(props.page ? props.page.description : 'Test description');
    const [required_knowledge, setRequiredKnowledge] = useState(props.page ? props.page.required_knowledge : ['Test required knowledge']);
    const [notes, setNotes] = useState(props.page ? props.page.notes : 'Test notes');
    const [programmes, setPrograms] = useState(props.page ? props.page.programmes : ['Test programme']);
    

    // useNavigate hook to change page
    const navigate = useNavigate();
    const location = useLocation();
    
    
    const nextpage = location.state?.nextpage || '/';

    const addProposal = (proposal) => {
      API.addProposal(proposal)
      .then(response => {
        console.log('proposal added')
        console.log(response);
      })
        .catch(e => {
          console.log("error!!!");
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

      const groups_array = [groups]
      const keywords_array = [keywords]
      const co_supervisor_array = [co_supervisor]
      const required_knowledge_array = [required_knowledge]
      const programmes_array = [programmes]

      const proposal = {
        "title": title.trim(),
        "supervisor": supervisor,
        "co_supervisor": co_supervisor_array,
        "type": type,
        "expiration": expiration,
        "level": level,
        "groups": groups_array,
        "keywords": keywords_array,
        "description": description.trim(),
        "required_knowledge": required_knowledge_array,
        "notes": notes.trim(),
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
                          <Form.Control type="date" value={expiration} onChange={event => setExpirationDate(event.target.value) } />
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
                            <option value= "1">1</option>
                            <option value="2" >2</option>
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
                          <Form.Control
                            type="text"
                            required={true}
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                            style={{ backgroundColor: type ? 'white' : 'azure' }}>
                          </Form.Control>
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
                <Link className="btn btn-danger m-2"  to={nextpage}>Go Back </Link>   
              </div>
 
            </Form>
        </>
    )
    
}

export default ProposalForm;