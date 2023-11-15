# Thesis Management - Frontend

## Thesis Management

Thesis Management is a web application designed to help Students and Professors keep track of their thesis. 
Students can enter and search for thesis topics that they are interested in, apply for them and check the application status.
Professors can view all or some thesis that they are interested in, create new thesis topics, process student applications and manage their own thesis projects.

## Applied technologies

The frontend is implemented by 'HTML+CSS+JavaScript+React+Vite'

## Fronted architecture

```
ThesisManagement
└── frontend
    └── src
        ├── pages
           └── ApplyToProposal.jsx  
           └── BrowseApplicaionDecision.jsx  
           └── BrowseProposal.jsx
           └── InfoBox.jsx 
           └── LoginPage.jsx 
           └── MainPage.jsx 
           └── Navigation.jsx
           └── ProposalForm.jsx 
           └── SearchForProposals.jsx    
        ├── API.JSX  --To connect to backend
        └── APP.css
        └── APP.jsx  --Containing all pages routing
        └── index.css
        └── main.jsx
```
## How to start using
1. Open a terminal in `frontend` folder.
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start loading pages.
4. Open a browser and input `http://localhost:5173/`.

## Pages Guide

1. First Common page for all. Everyone can browse all active thesis.
![normal_MainPage_nofilter](images/normal_MainPage_nofilter.png)
