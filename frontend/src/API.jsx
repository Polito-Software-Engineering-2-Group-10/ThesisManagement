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

const API = {addProposal};
export default API;