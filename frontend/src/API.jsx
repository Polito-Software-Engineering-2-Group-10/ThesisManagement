const URL ='http://localhost:3001/api';
import dayjs from 'dayjs'

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





const API = {
logIn,
logOut,
getUserInfo,
getTeacherDetail,
getStudentDetail,
getAllProposals,
addApplication
};
export default API;