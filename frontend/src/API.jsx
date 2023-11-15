const URL ='http://localhost:3001/api';



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

  async function getFormGroups() {
    const response = await fetch(URL+'/thesis/groups', {
      credentials: 'include'
    });
    const GroupDetail = await response.json();
    if (response.ok) {
      return GroupDetail;
    } else {
      throw GroupDetail;
    }
  }

  async function getFormCo_supervisor() {
    const response = await fetch(URL+'/thesis/types', {
      credentials: 'include'
    });
    const co_supervisorDetail = await response.json();
    if (response.ok) {
      return co_supervisorDetail;
    } else {
      throw co_supervisorDetail;
    }
  }

  async function getFormType() {
    const response = await fetch(URL+'/thesis/types', {
      credentials: 'include'
    });
    const typeDetail = await response.json();
    if (response.ok) {
      return typeDetail;
    } else {
      throw typeDetail;
    }
  }

  async function getFormLevel() {
    const response = await fetch(URL+'/thesis/types', {
      credentials: 'include'
    });
    const levelDetail = await response.json();
    if (response.ok) {
      return levelDetail;
    } else {
      throw levelDetail;
    }
  }

const API = {
logIn,
logOut,
getUserInfo,
getTeacherDetail,
getStudentDetail,
addProposal,
getFormGroups,
getFormCo_supervisor,
getFormType,
getFormLevel
};
export default API;