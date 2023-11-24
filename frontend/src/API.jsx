// FIXME: this should change when deploying on docker or locally
const URL = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/api`;

import dayjs from 'dayjs';

async function setVirtualClock(date) {
    let response = await fetch(URL + '/virtualclock', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({date: date})
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
// login,logout,session

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
    await fetch(URL+'/logout', {
      method: 'DELETE', 
      credentials: 'include' 
    });
  }
  
  async function getUserInfo() {
    const response = await fetch(URL+'/session', {
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
    const response = await fetch(URL+'/teacher/details', {
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
    const response = await fetch(URL+'/student/details', {
      credentials: 'include'
    });
    const studentDetail = await response.json();
    if (response.ok) {
      return studentDetail;
    } else {
      throw studentDetail;
    }
  }

  async function getAllProposals() {
    const response = await fetch(URL+'/ProposalsList', {
      credentials: 'include'
    });
    const propList = await response.json();
    if (response.ok) {
      return propList;
    } else {
      throw propList;
    }
  }

  async function getApplicationsList() {
    const response = await fetch(URL+'/student/ApplicationsList', {
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
    const response = await fetch(URL+'/teacher/ApplicationsList', {
      credentials: 'include'
    });
    const appList = await response.json();
    if (response.ok) {
      return appList;
    } else {
      throw appList;
    }
  }


  function addApplication(application) {
    return new Promise((resolve, reject) => {
      fetch(URL+`/student/applyProposal`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.assign({}, application, {proposal_id: application.proposal_id, apply_date: dayjs(application.apply_date).format('YYYY-MM-DD')}))
      }).then((response) => {
        if (response.ok) {
          response.json()
            .then((id) => resolve(id))
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
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

  async function getTeacherProposals() {
    const response = await fetch(`${URL}/teacher/ProposalsList`,{
      credentials: 'include'
  });
    const data = await response.json();
    return data;
}

async function acceptDeclineApplication(applicationId, status) {
  
  const response = await fetch(`${URL}/teacher/applicationDetail/${applicationId}`,{
    method: 'PATCH',  
    credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({status:status}),
  });
  const data = await response.json();
  return data;   
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  getTeacherProposals,
  getTeacherDetail,
  getStudentDetail,
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
  setVirtualClock
};

export default API;