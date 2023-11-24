# Additions
- [x] Pagination for proposals
- [ ] Virtual Clock
    - [ ] Add a button on the top of the screen to change time
    - [ ] All the users can change the time for test purposes
- [ ] Authentication with SAML + Docker

# FIXES
- [x] When professor accepts application, all other pending applications for that proposal (and of the student) are automatically rejected
- [x] For story 7, professor should see only **active** proposals
- [x] Accepted proposals are automatically archived
- [ ] When adding a thesis proposal, groups should be auto-selected from the supervisor and co-supervisors
- [ ] When student, only show proposals of his CdS
- [ ] Fix the fact that a professor can belong to more than one group
- [x] Separate list of proposals (archived / active)
- [ ] Remove button "browse proposals" from professor's page
- [ ]  (Salvo will do it)Add popup for every action that needs feedback (e.g. applying to a proposal, adding a proposal, etc.) 

## Problem with SAML
So currently SAML is not fully working. For some reason, when redirecting to the SAML login page, the browser outputs an error about CORS and origins and it doesn't allow the redirection. 

I am not fully sure on why this happens, I've debugged it a lot and didn't really find anything. I've tried all kinds of changes and google searches but nothing worked. The only thing that I found is that if I change the `fetch` call in the frontend login API to have a `mode: 'no-cors'` attribute in the options it works, but when you set no-cors, the response is "opaque" and thus you can't read the body of the response, making it completely useless.

If you want to debug it, you can try just running the frontend and backend separately as always, then run the SAML server by going in the `test-saml` folder and running `docker compose build` and `docker compose up` (you need docker installed). 

Then you can try logging in and you'll see the issue show up in the console.

To prove that saml works, you can go to `localhost:8080` and navigate to the saml test login page, and you'll see that it works.

