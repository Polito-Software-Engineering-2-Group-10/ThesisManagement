const URL ='http://localhost:3001/api';

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





const API = {
logIn,
logOut,
getUserInfo,
getTeacherDetail,
getStudentDetail,
getApplicationsList
};
export default API;