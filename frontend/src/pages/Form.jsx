import dayjs from 'dayjs';

import {useState, useContext} from 'react';
import {Form, Button, Alert, Image, Row, Col} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../API';
// import MessageContext from '../messageCtx';



const PageForm = (props) => {
   
    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [supervisor, setSupervisor] = useState(props.page ? props.page.supervisor : '');
    const [co_supervisor, setCoSupervisor] = useState(props.page ? props.page.co_supervisor : '');
    const [type, setType] = useState(props.page ? props.page.type : '');
    const [expiration_date, setExpirationDate] = useState(props.page ? props.page.expiration_date : '');
    const [level, setLevel] = useState(props.page ? props.page.level : '');
    const [groups, setGroups] = useState(props.page ? props.page.groups : '');
    const [keywords, setKeywords] = useState(props.page ? props.page.keywords : '');
    const [description, setDescription] = useState(props.page ? props.page.description : '');
    const [required_knowledge, setRequiredKnowledge] = useState(props.page ? props.page.required_knowledge : '');
    const [notes, setNotes] = useState(props.page ? props.page.notes : '');
    const [programs, setPrograms] = useState(props.page ? props.page.programs : '');
    

    // useNavigate hook to change page
    const navigate = useNavigate();
    const location = useLocation();
    const {handleErrors} = useContext(MessageContext);

    // if the page is successfully added or edited we return to the user's page(logged in), 
    // otherwise, if cancel is pressed, we go back to the previous location.
    const nextpage = location.state?.nextpage || '/';

    const page = {
        "title": title.trim(),
        "supervisor": supervisor,
        "co_supervisor": co_supervisor,
        "type": type,
        "expiration_date": expiration_date,
        "level": level,
        "groups": groups,
        "keywords": keywords,
        "description": description.trim(),
        "required_knowledge": required_knowledge.trim(),
        "notes":  notes.trim(),
        "programs": programs.trim(),
    };

    const handleTextChange = (index, value) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index].value = value;
        setBlocks(updatedBlocks);
    };
      
    const containerStyle_1 = {
        display: 'flex',
        flexDirection: 'row',
    };
    
    const containerStyle_2 = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };


    return (

     <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>
    
        <Form.Group className="mb-3">
          <Form.Label>Supervisor</Form.Label>
          <Form.Control type="text" required={true} value={supervisor} onChange={event => setSupervisor(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CoSupervisor</Form.Label>
          <Form.Control type="text" required={true} value={co_supervisor} onChange={event => setCoSupervisor(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control type="text" required={true} value={type} onChange={event => setType(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>
    
        <Form.Group className="mb-3">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control type="date" value={expiration_date} onChange={event => setExpirationDate(event.target.value) } readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Level</Form.Label>
          <Form.Control type="text" required={true} value={level} onChange={event => setLevel(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>
    
        <Form.Group className="mb-3">
          <Form.Label>Groups</Form.Label>
          <Form.Control type="text" required={true} value={groups} onChange={event => setGroups(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Keywords</Form.Label>
          <Form.Control type="text" required={true} value={keywords} onChange={event => setKeywords(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" required={true} value={description} onChange={event => setDescriptiondes(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Required Knowledge</Form.Label>
          <Form.Control type="text" required={true} value={required_knowledge} onChange={event => setRequiredKnowledge(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>
    
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control type="text" required={true} value={notes} onChange={event => setNotes(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Programs</Form.Label>
          <Form.Control type="text" required={true} value={programs} onChange={event => setPrograms(event.target.value)} readOnly
        style={{ pointerEvents: 'none' }}/>
        </Form.Group>


    
        
    
        <div className='row'>
          {blocks.map((row, index) => (
            <div className="row mb-3" key={index}>
              <div className='col-12'>
                <Form.Group style={containerStyle_1}>
                  {row.type===0 && (<Form.Control type="text" required={true} value={row.value} onChange={(e) => handleTextChange(index, e.target.value)}/>)}
                  {row.type===1 && (<Form.Control
                    as="textarea" rows={3} value={row.value} onChange={(e) => handleTextChange(index, e.target.value)}
                  />)}
                  {row.type===2 && (<Image className='mb-2' src={row.value} thumbnail value={index}/>)}
                </Form.Group>
              </div>
            </div>
          ))}
          </div>
    
        
        <Link className="btn btn-primary mb-3"  to={nextpage}> Back </Link>
     </Form>
    )
    
}

export default PageForm;