import {Accordion, Button} from 'react-bootstrap';
import {Link, useNavigate}   from 'react-router-dom';
import dayjs                 from 'dayjs';

export const AccordionElement = (props) => {
    const {id, title, professor, expiration, application, level, type, status, actions, supervisor, coSupervisor, student, description} = props; 

    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            {professor&& <p><b>Professor: </b>{professor}</p>}
            {supervisor && <p><b>Supervisor: </b>{supervisor}</p>}
            {coSupervisor && <p><b>Co-supervisors:  </b>{coSupervisor && coSupervisor?.join(", ")}</p>}
            {expiration   && <p><b>Expiration date:  </b>{dayjs(expiration).format('DD/MM/YYYY')}</p>}
            {application  && <p><b>Application date: </b>{dayjs(application).format('DD/MM/YYYY')}</p>}
            {type    && <p><b>Type:         </b>{type} </p>}
            {level   && <p><b>Level:        </b>{level}</p>}
            {status  && <p><b>Status:       </b>{status}</p>}
            {student && student[0] && <p><b>Student:      </b>{student[0]?.name} </p>}
            {student && student[0] && <p><b>Student Mail: </b>{student[0]?.email}</p>}
            {description && <p><b>Description: </b>{description}</p>}
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
                            Archive
                        </Button>
                    }
               
                    { /* archive button */
                        actions?.unarchive &&
                        <Button variant="primary" className='btn-archive' onClick={actions?.unarchive}>
                            <i className="bi bi-archive"></i>
                            Unarchive
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
                    { /* update button */
                        actions?.update &&
                        <Button className='update-btn' onClick={actions?.update}>
                            <i className="bi bi-pen"></i>
                            Update
                        </Button>
                    }
                </div>
            }
            </Accordion.Body>
      </Accordion.Item>
    ) 
}


