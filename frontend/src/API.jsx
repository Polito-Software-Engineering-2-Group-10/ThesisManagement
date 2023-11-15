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


  async function getProposals() {
    const response = await fetch(`${URL}/teacher/ProposalsList`,{
      credentials: 'include'
  });
    const data = await response.json();
    return data;
    
}



const API = {
logIn,
logOut,
getUserInfo,
getProposals
};
export default API;