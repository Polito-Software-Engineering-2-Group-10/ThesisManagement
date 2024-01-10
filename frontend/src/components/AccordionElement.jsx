import {Accordion, Button} from 'react-bootstrap';
import {Link, useNavigate}   from 'react-router-dom';

export const AccordionElement = (props) => {
    const {id, title, professor, expiration, level, type, actions, supervisor, coSupervisor} = props; 

    return (
      <Accordion.Item eventKey={id} className='accordion-row'>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
            {professor&& <p><b>Professor: </b>{professor}</p>}
            {supervisor && <p><b>Supervisor: </b>{supervisor}r</p>}
            {coSupervisor && <p><b>co-supervisors: </b>{coSupervisor.join(", ")}</p>}
            <p><b>Expiration date: </b>{expiration}</p>
            <p><b>Type:       </b>{type}</p>
            <p><b>Level:      </b>{level}</p>

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
                </div>
            }
            </Accordion.Body>
      </Accordion.Item>
    ) 
}


