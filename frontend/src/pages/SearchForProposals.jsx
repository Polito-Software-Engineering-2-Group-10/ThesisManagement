import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Form, Table, Button, Badge, Card, FormGroup, Container, Row, Col} from 'react-bootstrap';
import {Navigation} from './Navigation.jsx';
import API from '../API.jsx';

function SearchForProposals(props) {

    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [types, setTypes] = useState(['']);
    const [keywords, setKeywords] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filters, setFilters] = useState({});
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect( () => {
        API.getAllProposals()
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        API.getAllTeachers()
            .then((data) => {
                setProfessors(data);
            })
            .catch((err) => console.log(err));
        API.getAllTypes()
            .then((data) => {
                setTypes(data);
            })
            .catch((err) => console.log(err));
        API.getAllKeywords()
            .then((data) => {
                setKeywords(data);
            })
            .catch((err) => console.log(err));
        API.getAllGroups()
            .then((data) => {
                setGroups(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleFilterClick = (filter) => {
        if(activeFilter && activeFilter!=filter) {
            const { [activeFilter]: removedFilter, ...restFilters } = filters;
            setFilters(restFilters);
        }
        setActiveFilter(filter);
    };

    const getProfessorsInformation = (professors, proposal) => {
        if (professors) {
            const prof = professors.find((a) => a.id == proposal.teacher_id);
            if (prof) {
                return `${prof.surname} ${prof.name}`;
            }
        }
        return '';
    }

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if(value!='' && value!=[]) {
            if (name === 'type') {
                if (filters.type && filters.type.includes(value)) {
                    setFilters({...filters, [name]: filters.type.filter((type) => type !== value)});
                } else if (filters.type) {
                    setFilters({...filters, [name]: [...filters.type, value]});
                } else {
                    setFilters({...filters, [name]: [value]});
                }
            } else if (name === 'keywords') {
                if (filters.keywords && filters.keywords.includes(value)) {
                    setFilters({...filters, [name]: filters.keywords.filter((keyword) => keyword !== value)});
                } else if (filters.keywords) {
                    setFilters({...filters, [name]: [...filters.keywords, value]});
                } else {
                    setFilters({...filters, [name]: [value]});
                }
            } else if (name == groups) {
                if (filters.groups && filters.groups.includes(value)) {
                    setFilters({...filters, [name]: filters.groups.filter((groups) => groups !== value)});
                } else if (filters.groups) {
                    setFilters({...filters, [name]: [...filters.groups, value]});
                } else {
                    setFilters({...filters, [name]: [value]});
                }
            } else {
                setFilters({...filters, [name]: value});
            }
        }
        else{
            const { [name]: removedFilter, ...restFilters } = filters;
            setFilters(restFilters);
        }
    };

    const handleApplyFilter = () => {
        console.log(filters)
        API.getFilteredProposals(filters)
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        setActiveFilter(null);
    };

    const handleCancelFilter = () => {
        setActiveFilter(null);
    };

    const handleRemoveFilter = (filter) => {
        const { [filter]: removedFilter, ...restFilters } = filters;
        setFilters(restFilters);
        console.log(restFilters)
        API.getFilteredProposals(restFilters)
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        setActiveFilter(null);
    };

    const handleTypeCheckboxChange = (selection, filter) => {
        setFilters((prevFilters) => {
            let updatedFilters;
            if (prevFilters[filter] && prevFilters[filter].includes(selection)) {
                updatedFilters = prevFilters[filter].filter((type) => type !== selection);
            }
            else if (prevFilters[filter]) {
                updatedFilters = [...prevFilters[filter], selection];
            }
            else {
                updatedFilters = [selection];
            }
            return {
                ...prevFilters,
                [filter]: updatedFilters,
            };
        });
    };

    return (
        <>
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            { (professors && proposals) ? 
                (
                    <div className="container mt-4">
                        <h1 className="text-center mt-4 mb-4">Thesis Proposals</h1>
                        { props.loggedIn ? 
                            <Container>
                                <Row>
                                    <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Button variant='primary' onClick={() => navigate('/')}>Main Page</Button>
                                    </Col>
                                </Row>
                            </Container>
                        : ''}
                        <Card className="mb-4" style={{marginTop: '20px'}}>
                            <Card.Body>
                                <div className="mb-3">
                                    <span>Filter by: </span>
                                    <Button
                                        variant={activeFilter === 'title' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('title')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Title
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'professor' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('professor')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Professor
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'expirationDate' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('expirationDate')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Expiration Date
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'type' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('type')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Type
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'level' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('level')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Level
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'keywords' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('keywords')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Keywords
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'groups' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('groups')}
                                        style={{ marginLeft: '10px', marginRight: '10px' }}
                                    >
                                        Groups
                                    </Button>
                                </div>
                                <div className="mb-3">
                                    Applied Filters:
                                    <span
                                        style={{ marginRight: '10px'}}
                                    />
                                    {(Object.entries(filters).map(([filter, value]) => (
                                        value && (
                                            <Badge
                                                key={filter}
                                                pill
                                                variant="info"
                                                className="mr-2 badge-clickable"
                                            >
                                                {filter}
                                                :
                                                {filter === 'title' ? value : ''}
                                        {filter === 'professor' ? professors.find((a) => a.id == value).surname : ''}
                                        {filter === 'expirationDate' ? new Date(value).toLocaleDateString() : ''}
                                        {filter === 'level' ? ((value==1) ? 'Bachelor' : 'Master') : ''}
                                                {(filter === 'type' || filter === 'keywords' || filter === 'groups') ? ' ...' : ''}
                                                <span
                                                    className="badge-close"
                                                    onClick={() => handleRemoveFilter(filter)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    &times;
                                                </span>
                                            </Badge>
                                        )
                                    )))}
                                </div>
                                {activeFilter && (
                                    <Form className="mt-3">
                                        {activeFilter === 'title' && (
                                            <Form.Group controlId='titleFilter'>
                                                <Form.Label>Filter by title:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="title"
                                                    placeholder={`Enter title...`}
                                                    value={filters.title || ''}
                                                    onChange={handleFilterChange}
                                                />
                                            </Form.Group>
                                        )}
                                        {activeFilter === 'professor' && (
                                            <div>
                                                <Form.Group controlId="professorFilter">
                                                    <Form.Label>Filter by Professor:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="professor"
                                                        value={filters.professor || ''}
                                                        onChange={handleFilterChange}
                                                    >
                                                        <option value="">All Professors</option>
                                                        {professors.map((professor) => (
                                                            <option key={professor.id} value={professor.id}>
                                                                {`${professor.surname} ${professor.name}`}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'expirationDate' && (
                                            <FormGroup>
                                                <Form.Label>Filter by expiration date:</Form.Label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={filters.date || ''}
                                                    onChange={handleFilterChange}
                                                />
                                                <span
                                                    style={{ marginRight: '10px'}}
                                                />
                                            </FormGroup>
                                        )}
                                        {activeFilter === 'level' && (
                                            <div>
                                                <Form.Group controlId="levelFilter">
                                                    <Form.Label>Filter by Level:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="level"
                                                        value={filters.level || ''}
                                                        onChange={handleFilterChange}
                                                    >
                                                        <option value=''>All Levels</option>
                                                        <option value='1'>Bachelor</option>
                                                        <option value='2'>Master</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'type' && (
                                            <div>
                                                <Form.Group controlId="typeFilter">
                                                    <Form.Label>Filter by type:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="type"
                                                        value={filters.type || []}
                                                        onChange={handleFilterChange}
                                                        multiple={true}
                                                    >
                                                        {types.map((type) => (
                                                            <option key={type} value={type}>
                                                                {type}
                                                            </option>
                                                        ))}
                                                    </Form.Control>

                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'keywords' && (
                                            <div>
                                                <Form.Group controlId="keywordsFilter">
                                                    <Form.Label>Filter by keywords:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="keywords"
                                                        value={filters.keywords || []}
                                                        onChange={handleFilterChange}
                                                        multiple={true}
                                                    >
                                                        {keywords.map((keyword) => (
                                                            <option key={keyword} value={keyword}>
                                                                {keyword}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'groups' && (
                                            <div>
                                                <Form.Group controlId="groupsFilter">
                                                    <Form.Label>Filter by groups:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="groups"
                                                        value={filters.groups || []}
                                                        onChange={handleFilterChange}
                                                        multiple={true}
                                                    >
                                                        {groups.map((group) => (
                                                            <option key={group} value={group}>
                                                                {group}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                        )}
                                        <Button
                                            variant="success"
                                            onClick={handleApplyFilter}
                                            style={{marginTop:'10px'}}
                                        >
                                            Apply Filter
                                        </Button>
                                        {' '}
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleCancelFilter}
                                            style={{marginTop:'10px'}}
                                        >
                                            Close Filter
                                        </Button>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Title</th>
                                <th style={{ textAlign: 'center' }}>Professor</th>
                                <th style={{ textAlign: 'center' }}>Expiration Date</th>
                                <th style={{ textAlign: 'center' }}>Type</th>
                                <th style={{ textAlign: 'center' }}>Level</th>
                            </tr>
                            </thead>
                            <tbody>
                            {proposals && (proposals.map((proposal, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link
                                            to={`/applyToProp/${proposal.id}`}
                                            className="text-primary"
                                        >
                                            {proposal.title}
                                        </Link>
                                    </td>
                                    <td>{getProfessorsInformation(professors, proposal)}</td>
                                    <td>{proposal.expiration.substring(0, proposal.expiration.indexOf("T"))}</td>
                                    <td>{proposal.type}</td>
                                    <td>{proposal.level == 1 ? 'Bachelor' : 'Master'}</td>
                                </tr>
                            )))}
                            </tbody>
                        </Table>
                    </div>
                )
            : ''}
        </>
    );
}
export default SearchForProposals;
