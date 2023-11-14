const URL ='http://localhost:3001/api';

async function getAllProposals() {
    const response = await fetch(`${URL}/ProposalsList`);
    const data = await response.json();
    return data;
}

async function getAllTeachers() {
    const response = await fetch(`${URL}/teacher/list`);
    const data = await response.json();
    return data;
}

async function getAllTypes() {
    const response = await fetch(`${URL}/thesis/types`);
    const data = await response.json();
    return data;
}

async function getAllKeywords() {
    const response = await fetch(`${URL}/thesis/keywords`);
    const data = await response.json();
    return data;
}

async function getAllGroups() {
    const response = await fetch(`${URL}/thesis/groups`);
    const data = await response.json();
    return data;
}

async function getFilteredProposals(filters) {
    const filtersObject = {
        "title": filters.title,
        "professor": filters.professor,
        "date": filters.date,
        "type": filters.type,
        "keywords": filters.keywords,
        "level": filters.level,
        "groups": filters.groups,
    }
    const response = await fetch(`${URL}/ProposalsList/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtersObject),
    });
    const data = await response.json();
    return data;
}

const API = {
    getAllProposals,
    getAllTeachers,
    getAllTypes,
    getFilteredProposals,
    getAllKeywords,
    getAllGroups,
};
export default API;