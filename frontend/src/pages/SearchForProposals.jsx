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

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if(value!='' && value!=[]) {
            setFilters({...filters, [name]: value});
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
        const { [activeFilter]: removedFilter, ...restFilters } = filters;
        setFilters(restFilters);
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
                        <Container>
                            <Row>
                                <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Button variant='primary' onClick={() => navigate('/')}>Main Page</Button>
                                </Col>
                            </Row>
                        </Container>
                        <Card className="mb-4" style={{marginTop: '20px'}}>
                            <Card.Body>
                                <div className="mb-3">
                                    <span>Filter by: </span>
                                    <Button
                                        variant={activeFilter === 'title' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('title')}
                                    >
                                        Title
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'professor' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('professor')}
                                    >
                                        Professor
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'expirationDate' ? 'info' : 'outline-info'}
                                        className="mr-2"
                                        onClick={() => handleFilterClick('expirationDate')}
                                    >
                                        Expiration Date
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'type' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('type')}
                                    >
                                        Type
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'level' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('level')}
                                    >
                                        Level
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'keywords' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('keywords')}
                                    >
                                        Keywords
                                    </Button>
                                    <Button
                                        variant={activeFilter === 'groups' ? 'info' : 'outline-info'}
                                        onClick={() => handleFilterClick('groups')}
                                    >
                                        Groups
                                    </Button>
                                </div>
                                <div className="mb-3">
                                    Applied Filters:
                                    <span
                                        style={{ marginRight: '10px'}}
                                    />
                                    {!activeFilter && (Object.entries(filters).map(([filter, value]) => (
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
                                                    {types.map((type) => (
                                                        <Form.Check
                                                            key={type}
                                                            type="checkbox"
                                                            id={`checkbox-${type}`}
                                                            label={type}
                                                            checked={filters.type && filters.type.includes(type)}
                                                            onChange={() => handleTypeCheckboxChange(type, "type")}
                                                        />
                                                    ))}
                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'keywords' && (
                                            <div>
                                                <Form.Group controlId="keywordsFilter">
                                                    <Form.Label>Filter by keywords:</Form.Label>
                                                    {keywords.map((keyword) => (
                                                        <Form.Check
                                                            key={keyword}
                                                            type="checkbox"
                                                            id={`checkbox-${keyword}`}
                                                            label={keyword}
                                                            checked={filters.keywords && filters.keywords.includes(keyword)}
                                                            onChange={() => handleTypeCheckboxChange(keyword, "keywords")}
                                                        />
                                                    ))}
                                                </Form.Group>
                                            </div>
                                        )}
                                        {activeFilter === 'groups' && (
                                            <div>
                                                <Form.Group controlId="groupsFilter">
                                                    <Form.Label>Filter by groups:</Form.Label>
                                                    {groups.map((group) => (
                                                        <Form.Check
                                                            key={group}
                                                            type="checkbox"
                                                            id={`checkbox-${group}`}
                                                            label={group}
                                                            checked={filters.groups && filters.groups.includes(group)}
                                                            onChange={() => handleTypeCheckboxChange(group, "groups")}
                                                        />
                                                    ))}
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
                                    <td>{professors.find((a) => a.id == proposal.teacher_id).surname + " " +
                                        professors.find((a) => a.id == proposal.teacher_id).name}</td>
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
