import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Form, Table, Button, Badge, Card } from 'react-bootstrap';
import Navigation from './Navigation.jsx';
import API from '../API.jsx';

function SearchForProposals(props) {
    const thesisData = [
        { title: "Tesi 1", professor: "Prof. Rossi", expirationDate: "2023-12-31", type: "A" },
        { title: "Tesi 2", professor: "Prof. Bianchi", expirationDate: "2023-11-30", type: "B" },
        { title: "Tesi 3", professor: "Prof. Verdi", expirationDate: "2023-10-15", type: "A" },
        { title: "Tesi 4", professor: "Prof. Rossi", expirationDate: "2023-09-31", type: "C" },
        { title: "Tesi 5", professor: "Prof. Rossi", expirationDate: "2023-11-22", type: "B" },
        { title: "Tesi 6", professor: "Prof. Verdi", expirationDate: "2023-01-15", type: "B" },
    ];

    /*useEffect( () => {
        API.getAllProposals()
            .then((data) => {
                console.log(data)
                setProposals(data);
            })
            .catch((err) => console.log(err));
    }, []);*/

    const [proposals, setProposals] = useState([])
    const [filters, setFilters] = useState({});
    const [activeFilter, setActiveFilter] = useState(null);

    const handleFilterClick = (filter) => {
        if (activeFilter && filters[activeFilter]) {
            setFilters({ ...filters, [activeFilter]: '' });
        }
        setActiveFilter(filter);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleApplyFilter = () => {
        setFilters({ ...filters, [activeFilter]: filters[activeFilter] });
        setActiveFilter(null);
    };

    const handleCancelFilter = () => {
        setFilters({ ...filters, [activeFilter]: '' });
        setActiveFilter(null);
    };

    const handleRemoveFilter = (filter) => {
        const { [filter]: removedFilter, ...restFilters } = filters;
        setFilters(restFilters);
    };

    const filteredThesisData = thesisData.filter(thesis => {
        return (
            (!filters.title || thesis.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (!filters.professor || thesis.professor.toLowerCase().includes(filters.professor.toLowerCase())) &&
            (!filters.expirationDate || thesis.expirationDate.toLowerCase().includes(filters.expirationDate.toLowerCase())) &&
            (!filters.type || thesis.type.toLowerCase() === filters.type.toLowerCase())
        );
    });

    return (
        <>
            <Navigation/>
            <div className="container mt-4">
                <h1 className="text-center mt-4 mb-4">Thesis Proposals</h1>
                <Card className="mb-4">
                    <Card.Body>
                        <div className="mb-3">
                            <span>Filter by: </span>
                            <Button
                                variant={activeFilter === 'title' ? 'info' : 'outline-info'}
                                className="mr-2"
                                onClick={() => handleFilterClick('title')}
                            >
                                Thesis Title
                            </Button>
                            <Button
                                variant={activeFilter === 'professor' ? 'info' : 'outline-info'}
                                className="mr-2"
                                onClick={() => handleFilterClick('professor')}
                            >
                                Professor's Name
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
                                Thesis Type
                            </Button>
                        </div>
                        <div className="mb-3">
                            Applied Filters:
                            <span
                                style={{ marginRight: '10px'}}
                            />
                            {Object.entries(filters).map(([filter, value]) => (
                                value && (
                                    <Badge
                                        key={filter}
                                        pill
                                        variant="info"
                                        className="mr-2 badge-clickable"
                                    >
                                        {filter}
                                        :
                                        {filter === 'expirationDate' ? new Date(value).toLocaleDateString() : value}{' '}
                                        <span
                                            className="badge-close"
                                            onClick={() => handleRemoveFilter(filter)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            &times;
                                        </span>
                                    </Badge>
                                )
                            ))}
                        </div>
                        {activeFilter && (
                            <Form className="mt-3">
                                {activeFilter === 'expirationDate' ? (
                                    <>
                                        <input
                                            type="date"
                                            name={activeFilter}
                                            value={filters[activeFilter] || ''}
                                            onChange={handleFilterChange}
                                        />
                                        <span
                                            style={{ marginRight: '10px'}}
                                        />
                                    </>
                                ) : (
                                    <Form.Group controlId={`filter${activeFilter}`}>
                                        <Form.Control
                                            type="text"
                                            name={activeFilter}
                                            placeholder={`Enter ${activeFilter}...`}
                                            value={filters[activeFilter] || ''}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
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
                        <th>Thesis' Title</th>
                        <th>Professor's Name</th>
                        <th>Expiration Date</th>
                        <th>Thesis' Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredThesisData.map((thesis, index) => (
                        <tr key={index}>
                            <td>
                                <Link
                                    to={`./${thesis.title}`}
                                    className="text-primary"
                                >
                                    {thesis.title}
                                </Link>
                            </td>
                            <td>{thesis.professor}</td>
                            <td>{thesis.expirationDate}</td>
                            <td>{thesis.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}
export default SearchForProposals;
