import {useEffect, useState, useContext} from 'react';
import {Link, useNavigate}   from 'react-router-dom';
import {Form, Table, Button, Badge, Card, FormGroup, Container, Row, Col, Accordion} from 'react-bootstrap';
import {Navigation} from './Navigation.jsx';
import API from '../API.jsx';
import "../styles/pagination.css";
import "../styles/SearchProposal.css";
import AppContext from '../AppContext.jsx';

import ReactPaginate from 'react-paginate';
import { AccordionElement } from '../components/AccordionElement.jsx';


function Proposals( { currentProposals, getProfessorsInformation, professors, perPage, sortColumn, sortOrder, handleSort }) {
const navigate=useNavigate();
    return (
        <Accordion>
        
        {currentProposals && currentProposals.map((proposal, index) => (
            <AccordionElement
                key={index}
                id={proposal.id}
                title={proposal.title}
                professor={getProfessorsInformation(professors, proposal)}
                expiration={proposal.expiration.substring(0, proposal.expiration.indexOf("T"))}
                level={proposal.level == 1 ? 'Bachelor' : 'Master'}
                type={proposal.type}
                actions={{
                    view: `/applyToProp/${proposal.id}`
                }}
            />
        ))}
            
        </Accordion>
    )
}

function PaginatedProposals( { itemsPerPage, proposalList, getProfessorsInformation, professors, sortColumn, sortOrder, handleSort  }) {
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        const newItems = proposalList.slice(itemOffset, endOffset);
        setCurrentItems(newItems);
        setPageCount(Math.ceil(proposalList.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, proposalList.length, proposalList])

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % proposalList.length;
        setItemOffset(newOffset);
    }

    return (
        <>    <Proposals currentProposals={currentItems} getProfessorsInformation={getProfessorsInformation} professors={professors} perPage={itemsPerPage} sortColumn={sortColumn}
                sortOrder={sortOrder}
                handleSort={handleSort}/>

            <ReactPaginate 
                nextLabel='>'
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                previousLabel='<'
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
        </>
    )
}

function SearchForProposals(props) {
    const navigate = useNavigate();

    const { proposalsDirty } = useContext(AppContext);

    const [proposals, setProposals] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [types, setTypes] = useState(['']);
    const [keywords, setKeywords] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filters, setFilters] = useState({});
    const [activeFilter, setActiveFilter] = useState(null);
    const [studInfo,setStudInfo]=useState(null);
    const [dirty2,setDirty2]=useState(true);
    
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const [keywordFilter, setKeywordFilter] = useState('');
    
    const [sortedProposals, setsortedProposals] = useState([]);

    useEffect(()=>{
        if (props.user && props.user.role==="student")
        {
        API.getStudentDetail()
        .then((data)=>{
            if (data!=null){
            setStudInfo(data)
            setDirty2(false);
             }
        })
        .catch((err)=>
        console.log(err));
    }


    },[props.user,dirty2])

    useEffect(() => {
        
        if(props.user && studInfo && props.user.role==="student")
        {  
            if (Object.keys(filters).length === 0) {
                API.getAllProposalsForStudent(studInfo.cod_degree)
                    .then((data) => {
                        setProposals(data);
                    })
                    .catch((err) => console.log(err));
            } else {
                API.getFilteredProposals(filters, studInfo.cod_degree)
                .then((data) => {
                    setProposals(data);
                })
                .catch((err) => console.log(err));
            }
        }
        else{
        if (Object.keys(filters).length === 0) {
            API.getAllProposals()
                .then((data) => {
                    setProposals(data);
                })
                .catch((err) => console.log(err));
        } else {
            API.getFilteredProposals(filters)
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        }
    }}, [proposalsDirty,studInfo,props.user])

    useEffect( () => {
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

    useEffect(() => {
        setsortedProposals((proposals || []).slice().sort((a, b) => {
            if (sortColumn) {
              const aValue = a[sortColumn];
              const bValue = b[sortColumn];
          
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
              }
          
              return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        }));
    }, [sortOrder, sortColumn, proposals])

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
            } else if (name == 'groups') {
                if (filters.groups && filters.groups.includes(value)) {
                    setFilters({...filters, [name]: filters.groups.filter((group) => group !== value)});
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
        API.getFilteredProposals(filters, studInfo?.cod_degree)
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        setActiveFilter(null);
    };

    const handleCancelFilter = () => {
        setActiveFilter(null);
        setKeywordFilter('');
    };

    const handleRemoveFilter = (filter) => {
        const { [filter]: removedFilter, ...restFilters } = filters;
        setFilters(restFilters);
        API.getFilteredProposals(restFilters, studInfo?.cod_degree)
            .then((data) => {
                setProposals(data);
            })
            .catch((err) => console.log(err));
        setActiveFilter(null);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
           setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          // If a new column is clicked, It will be the sorting column with ascending order
          setSortColumn(column);
          setSortOrder('asc');
        }
    }; 
    
    
    return (
        <>
         { !props.loggedIn ?
            <Navigation logout={props.logout} loggedIn={props.loggedIn} user={props.user}/>
            :
            ''
            
        }
            { (professors && sortedProposals) ? 
                (   

                    /*<div className="container mt-4">*/
                    <div className='container-filter-proposal'>
                                <Card id="card-filter" className="mb-4">
                                    <Card.Body>
                                        <div className="mb-3">
                                            <h5 display="inline-block "> Filter by: </h5>
                                            <Button
                                                onClick={() => handleFilterClick('title')}
                                                className={activeFilter === 'title' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Title
                                            </Button>

                                            <Button
                                                onClick={() => handleFilterClick('professor')}
                                                className={activeFilter === 'professor' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Professor
                                            </Button>

                                            <Button
                                                onClick={() => handleFilterClick('expirationDate')}
                                                className={activeFilter === 'expirationDate' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Expiration Date
                                            </Button>
                                            <Button
                                               
                                                onClick={() => handleFilterClick('type')}
                                                className={activeFilter === 'type' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Type
                                            </Button>
                                            <Button
                                                
                                                onClick={() => handleFilterClick('level')}
                                                className={activeFilter === 'level' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Level
                                            </Button>
                                            <Button
                                                
                                                onClick={() => handleFilterClick('keywords')}
                                                className={activeFilter === 'keywords' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Keywords
                                            </Button>
                                            <Button
                                                
                                                onClick={() => handleFilterClick('groups')}
                                                className={activeFilter === 'groups' ? 'selected search-filter-btn' : 'search-filter-btn'}
                                            >
                                                Groups
                                            </Button>
                                        </div>
                                        <div className="mb-3">
                                            <h6>Applied Filters:</h6>
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
                                                            onKeyDown={() => handleRemoveFilter(filter)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            &times;
                                                        </span>
                                                    </Badge>
                                                )
                                            )))}
                                        </div>
                                        <hr />
                                        <Button className='search-filter-btn' onClick={
                                            () => {
                                                setFilters({});
                                                API.getFilteredProposals({}, studInfo?.cod_degree)
                                                .then((data) => {
                                                    setProposals(data);
                                                })
                                                .catch((err) => console.log(err));
                                            }
                                        }>
                                                Clear all filters
                                        </Button>
                                        {activeFilter && (
                                            <Form className="mt-3" onSubmit={(ev) => { ev.preventDefault(); handleApplyFilter(); }}>
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
                                                            <Form.Control type="text" placeholder='Filter keyword list...' value={keywordFilter} onChange={(ev) => setKeywordFilter(ev.target.value)}></Form.Control>
                                                            <hr />
                                                            <Form.Control
                                                                as="select"
                                                                name="keywords"
                                                                value={filters.keywords || []}
                                                                onChange={handleFilterChange}
                                                                multiple={true}
                                                            >
                                                                {keywords.filter(x => x.toLowerCase().includes(keywordFilter.toLowerCase())).map((keyword) => (
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
                                                    
                                                    onClick={handleApplyFilter}
                                                    
                                                    className='apply-btn'
                                                >
                                                    Apply Filter
                                                </Button>
                                                {' '}
                                                <Button
                                                    
                                                    onClick={handleCancelFilter}
                                                    className='cancel-btn'
                                                >
                                                    Close Filter
                                                </Button>
                                            </Form>
                                        )}
                                    </Card.Body>
                                </Card>
                                {/* this items per page count is a sister variable with the 10% height in pagination.css in the .thesis-proposal class filter
                                    if you change one you have to change the other 
                                    I'm using fixed height rows because that way it avoids having the navigation bar at the bottom of the page shift around because of the table constant resizing    
                                */}
                                    <Card id="card-proposal" className="mb-4" >
                                    <PaginatedProposals itemsPerPage={10} proposalList={sortedProposals} getProfessorsInformation={getProfessorsInformation} professors={professors} handleSort={handleSort}/>
                                    </Card>
                        
                    </div>
                    //</div>
                )
            : ''}
        </>
    );
}



export default SearchForProposals;
