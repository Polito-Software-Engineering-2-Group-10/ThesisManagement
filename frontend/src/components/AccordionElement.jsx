import {Accordion, Button} from 'react-bootstrap';
import {Link, useNavigate}   from 'react-router-dom';
import dayjs                 from 'dayjs';

export const AccordionElement = (props) => {
    const {id, title, professor, expiration, level, type, actions, supervisor, coSupervisor, student} = props; 

    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            {professor&& <p><b>Professor: </b>{professor}</p>}
            {supervisor && <p><b>Supervisor: </b>{supervisor}r</p>}
            {coSupervisor && coSupervisor.length > 0 ? <p><b>Co-supervisors: </b>{coSupervisor && coSupervisor?.join(", ")}</p> : <p><b>Co-supervisors:</b> No co-supervisor assigned.</p> }
            <p><b>Expiration date: </b>{dayjs(expiration).format('DD/MM/YYYY')}</p>
            {type    && <p><b>Type:         </b>{type} </p>}
            {level   && <p><b>Level:        </b>{level}</p>}
            {student && student[0] && <p><b>Student:      </b>{student[0]?.name} </p>}
            {student && student[0] && <p><b>Student Mail: </b>{student[0]?.email}</p>}

            {
                actions && 
                <div className="accordion-row-buttons">
                    {
                        /* view button */
                        actions?.view &&
                        <Link
                            to={actions?.view}
                            className="text-primary"
                            style={{textDecoration : "none"}}
                        >
                            <Button variant="primary" className='btn-view'>
                                <i className="bi bi-file-earmark-fill"></i>
                                View
                            </Button>
                        </Link>
                    }
                
                    {
                        /* edit button */
                        actions?.edit &&
                            <Button variant="primary" className='btn-edit' onClick={actions?.edit}>
                                <i className="bi bi-pencil-square"></i>
                                Edit
                            </Button>
                    }
                
                    { /* copy button */
                        actions?.copy &&
                        <Button variant="primary" className='btn-copy' onClick={actions?.copy}>
                            <i className="bi bi-clipboard-plus"></i>
                            Copy
                        </Button>
                    }

                    { /* archive button */
                        actions?.archive &&
                        <Button variant="primary" className='btn-archive' onClick={actions?.archive}>
                            <i className="bi bi-archive"></i>
                            archive
                        </Button>
                    }
               
                    { /* archive button */
                        actions?.unarchive &&
                        <Button variant="primary" className='btn-archive' onClick={actions?.unarchive}>
                            <i className="bi bi-archive"></i>
                            unarchive
                        </Button>
                    }
                  
                    { /* delete button */
                        actions?.delete &&
                        <Button variant="primary" className='btn-delete' onClick={actions?.delete}>
                            <i className="bi bi-trash"></i>
                            Delete
                        </Button>
                    }
                
                    { /* reject button */
                        actions?.reject &&
                        <Button className='reject-btn' onClick={actions?.reject}>
                            <i className="bi bi-x-circle"></i>
                            Reject
                        </Button>
                    }
                
                    { /* accept button */
                        actions?.accept &&
                        <Button className='accept-btn' onClick={actions?.accept}>
                            <i className="bi bi-check-circle"></i>
                            Accept
                        </Button>
                    }
                </div>
            }
            </Accordion.Body>
      </Accordion.Item>
    ) 
}


