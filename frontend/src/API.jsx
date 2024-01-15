// FIXME: this should change when deploying on docker or locally
const URL = `http://localhost:3001/api`;

import dayjs from 'dayjs';

async function setVirtualClock(date) {
    let response = await fetch(URL + '/virtualclock', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date })
    });
    if (response.ok) {
        const respDetail = await response.json();
        return respDetail;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function getVirtualClock() {
    let response = await fetch(URL + '/virtualclock', {
        credentials: 'include',
        method: 'GET',
    });
    if (response.ok) {
        const respDetail = await response.json();
        return respDetail;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }

}

async function resetVirtualClock() {
    let response = await fetch(URL + '/virtualclock', {
        credentials: 'include',
        method: 'DELETE',
    });
    if (response.ok) {
        const respDetail = await response.json();
        return respDetail;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function addProposal(proposal) {
    let response = await fetch(URL + '/teacher/insertProposal', {
        credentials: 'include',
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposal)
    });
    if (response.ok) {
        const respDetail = await response.json();
        return respDetail;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function applyRequest(thesis_request, thesis_id) {
    let response = await fetch(URL + `/student/applyRequest/${thesis_id}`, {
        credentials: 'include',
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(thesis_request)
    });
    if (response.ok) {
        const respDetail = await response.json();
        return respDetail;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}
// login,logout,session

async function logInWithSaml() {
    window.location.replace("http://localhost:3001/api/saml/login");
}

async function logOutWithSaml() {
    window.location.replace("http://localhost:3001/api/saml/logout");
}

async function logIn(credentials) {
    let response = await fetch(URL + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL + '/logout', {
        method: 'DELETE',
        credentials: 'include'
    });
}

async function getUserInfo() {
    const response = await fetch(URL + '/session', {
        credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // object with error returned from server
    }
}

async function getTeacherDetail() {
    const response = await fetch(URL + '/teacher/details', {
        credentials: 'include'
    });
    const teacherDetail = await response.json();
    if (response.ok) {
        return teacherDetail;
    } else {
        throw teacherDetail;
    }
}

async function getStudentDetail() {
    const response = await fetch(URL + '/student/details', {
        credentials: 'include'
    });
    const studentDetail = await response.json();
    if (response.ok) {
        return studentDetail;
    } else {
        throw studentDetail;
    }
}

async function getClerkDetail() {
    const response = await fetch(URL + '/clerk/details', {
        credentials: 'include'
    });
    const clerkDetails = await response.json();
    if (response.ok) {
        return clerkDetails;
    } else {
        throw clerkDetails;
    }
}

async function getAllThesisRequests() {
    const response = await fetch(URL + '/clerk/Requestlist', {
        credentials: 'include'
    });
    const requestsList = await response.json();
    if (response.ok) {
        return requestsList;
    } else {
        throw requestsList;
    }
}

async function getAllThesisRequestsForStudent() {
    const response = await fetch(URL + '/student/Requestlist', {
        credentials: 'include'
    });
    const requestsList = await response.json();
    if (response.ok) {
        return requestsList;
    } else {
        throw requestsList;
    }
}

async function updateThesisRequest(requestid, request){
    const response = await fetch(`${URL}/student/Requestlist/${requestid}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: request.title, description: request.description, co_supervisor: request.co_supervisor}), 
    });

    const request_info = await response.json();
    if (response.ok) {
        return request_info;
    } else {
        throw request_info;
    }
}

async function AcceptOrRejectThesisRequestClerk(request_id, status) {
    const response = await fetch(`${URL}/clerk/Requestlist/${request_id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status_clerk: status}), 
    });

    const thesis_request = await response.json();
    if (response.ok) {
        return thesis_request;
    } else {
        throw thesis_request;
    }
}

async function getAllProposals() {
    const response = await fetch(URL + '/ProposalsList', {
        credentials: 'include'
    });
    const propList = await response.json();
    if (response.ok) {
        return propList;
    } else {
        throw propList;
    }
}

// function to retrive a list of proposals for the cosupervisor
async function getCosupProposals() {
    const response = await fetch(URL + '/cosup/ProposalsList', {
        credentials: 'include'
    });
    const propList = await response.json();
    if (response.ok) {
        return propList;
    } else {
        throw propList;
    }
}

async function getProposal(id) {
    const response = await fetch(URL + '/proposal/' + id, {
        credentials: 'include'
    });
    const prop = await response.json();
    if (response.ok) {
        return prop;
    } else {
        throw prop;
    }

}

async function getAllProposalsForStudent(cod_degree) {
    const response = await fetch(URL + '/student/ProposalsList', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cod_degree: cod_degree }),
    });
    const propList = await response.json();
    if (response.ok) {
        return propList;
    } else {
        throw propList;
    }
}

async function getApplicationsList() {
    const response = await fetch(URL + '/student/ApplicationsList', {
        credentials: 'include'
    });
    const appList = await response.json();
    if (response.ok) {
        return appList;
    } else {
        throw appList;
    }
}

async function getApplicationsListTeacher() {
    const response = await fetch(URL + '/teacher/ApplicationsList', {
        credentials: 'include'
    });
    const appList = await response.json();
    if (response.ok) {
        return appList;
    } else {
        throw appList;
    }
}


async function addApplication(application) {
    const data = new FormData();
    data.append('file', application.file);
    data.append('proposal_id', application.proposal_id);
    data.append('apply_date', dayjs(application.apply_date).format('YYYY-MM-DD'));
    const response = await fetch(URL + '/student/applyProposal', {
        method: 'POST',
        credentials: 'include',
        body: data
    });

    if (response.ok) {
        const id = await response.json();
        return id;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function getAllTeachers() {
    const response = await fetch(`${URL}/teacher/list`);
    const data = await response.json();
    return data;
}

async function getAllStudents() {
    const response = await fetch(`${URL}/student/list`);
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

async function getFilteredProposals(filters, cod_degree) {
    const filtersObject = {
        "title": filters.title,
        "professor": filters.professor,
        "date": filters.date,
        "type": filters.type,
        "keywords": filters.keywords,
        "level": filters.level,
        "groups": filters.groups,
        "cod_degree": cod_degree
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

async function getTeacherProposals() {
    const response = await fetch(`${URL}/teacher/ProposalsList`, {
        credentials: 'include'
    });
    const data = await response.json();
    return data;
}

async function acceptDeclineApplication(mailInfo) {
    const response = await fetch(`${URL}/teacher/applicationDetail/${mailInfo.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: mailInfo.status }),
    });

    const data = await response.json();
    if (response.status == 200) {
        await fetch(`${URL}/send_email`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient_mail: mailInfo.student_email,
                subject: `Result on your application about ${mailInfo.thesis_title}`,
                message: `Hello ${mailInfo.student_gender == 'M' ? 'Mr.' : 'Mrs.'} ${mailInfo.student_name} ${mailInfo.student_surname},\nyour thesis application for the ${mailInfo.thesis_title} proposal, supervised by professor ${mailInfo.teacher_surname}, has been ${mailInfo.status ? 'Accepted' : 'Rejected'}.\nBest Regards, Polito Staff.`
            }),
        });
    }
    return data;
}

async function updateProposal(proposal) {
    const id = proposal.id;
    delete proposal.id;

    const response = await fetch(`${URL}/teacher/updateProposal/${id}`, {
        credentials: 'include',
        method: 'PUT',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposal)
    });

    const data = await response.json();
    return data;
}


async function deleteProposal(proposalId, mailInfo) {
    const response = await fetch(`${URL}/teacher/deleteProposal`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposalId: proposalId }),
    });
    const data = await response.json();
    return { data, status: response.status };
}

async function retrieveCoSupervisorsGroups(co_supervisor_array) {
    const response = await fetch(`${URL}/teacher/retrieveCosupGroup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cosup_mails: co_supervisor_array }),
    });
    const data = await response.json();
    return data;
}
async function archiveProposal(proposalId, status) {

    const response = await fetch(`${URL}/teacher/ProposalsList/${proposalId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
    });
    const data = await response.json();
    return data;
}

async function uploadFile(file){

    const formData = new FormData()
    formData.append('file', file)
    const response= await fetch('http://localhost:3001/upload',
    {
        method:'POST',
        body:formData
    });
    return response.json();

}

async function getStudentGeneratedCv(applicationId, studentId) {
    const response = await fetch(`${URL}/teacher/getGeneratedCV/${applicationId}`, {
        credentials: 'include',
        method: 'GET',
    });
    if (response.ok) {
        const blob = await response.text();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${studentId}_generated_cv.pdf`);
        document.body.appendChild(link);
        link.click();
        return {};
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function getStudentSubmittedCv(applicationId, studentId) {
    const response = await fetch(`${URL}/teacher/getSubmittedCV/${applicationId}`, {
        credentials: 'include',
        method: 'GET',
    });
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${studentId}_generated_cv.pdf`);
        document.body.appendChild(link);
        link.click();
        return {};
    } else if (response.status === 404) {
        return {
            status: 404,
            message: 'No CV submitted by the student'
        };
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

const API = {
    logInWithSaml,
    logOutWithSaml,
    logIn,
    logOut,
    getUserInfo,
    getProposal,
    getTeacherProposals,
    getTeacherDetail,
    getStudentDetail,
    getClerkDetail,
    getAllProposals,
    addApplication,
    getAllTeachers,
    getAllTypes,
    getFilteredProposals,
    getAllKeywords,
    getAllGroups,
    getApplicationsList,
    addProposal,
    getApplicationsListTeacher,
    acceptDeclineApplication,
    updateProposal,
    setVirtualClock,
    getVirtualClock,
    resetVirtualClock,
    getAllProposalsForStudent,
    deleteProposal,
    retrieveCoSupervisorsGroups,
    archiveProposal,
    uploadFile,
    getStudentGeneratedCv,
    getStudentSubmittedCv,
    applyRequest,
    getAllThesisRequests,
    getAllThesisRequestsForStudent,
    getAllStudents,
    AcceptOrRejectThesisRequestClerk,
    updateThesisRequest,
    getCosupProposals
};

export default API;