# Backend of ThesisManagement

Structure:
- config\

    - config.js (configuration file, most of the configurations are taken from the environment variables)

    - passport-config.js (passport configuration file, this contains both the config for saml and for normal login)

- entities\

    - this folder contains the entities and tables of the database

- dbdriver.js (this file contains the class responsible for the connection to the database)

- dbentities.js (this file is just a wrapper for the entities to forward declare them)

- index.js (this file is the entry point of the backend)

- .env (this file contains the environment variables that will be used to configure the backend, modify this if needed with the correct values for ports/urls/credentials)
- .dockerenv (this file contains the environment variables that will be used to configure the backend when running in docker, modify this if needed with the correct values for ports/urls/credentials)

## How to use
Simply run `npm install` to install all the dependencies and then `npm run dev` to start the backend.

By default it will listen on port 3001 and accept connections from localhost:5173 (the frontend), these can be changed in the `.env` file under the keys `PORT`, `FRONTEND_URL` and `FRONTEND_PORT` respectively.

The database `thesismanagement` will be attempted to be connected to using the credentials user: `thesismanager` and password: `thesismanager`, at the address `localhost:5432`, these can be changed in the `.env` file under the keys `DATABASE_HOST` and `DATABASE_PORT` respectively.

## APIs
The backend exposes the following APIs:

- POST `/api/login`
    - This API accepts a JSON object with the following structure:
    ```json
    {
        "email": "mario.rossi@studenti.polito.it",
        "password": 1
    }
    ```
    - The password is the ID of the user, this endpoint accepts both students and teachers
    This endpoint returns a user object like so:
    ```json
    {
        "id": 1,
        "email": "mario.rossi@studenti.polito.it",
        "name": "Mario",
        "surname": "Rossi",
        "role": "student"
    }
    ```
    - The role field indicates if the user is a student or a teacher. Only valid values are `student` and `teacher` 

- DELETE `/api/logout`
    - This API accepts no parameters, it will simply log out the user
- GET `/api/session`
    - This API accepts no parameters, it will return the current logged-in user
- GET `/api/student/details`
    - This API requires authentication as a student, it will return the details about the logged in student in a form such as
    ```json
    {
        "id": 1,
        "surname": "Rossi",
        "name": "Mario",
        "gender": "M",
        "nationality": "Italian",
        "email": "mario.rossi@studenti.polito.it",
        "cod_degree": "L-08",
        "enrollment_year": "2022-09-09T22:00:00.000Z",
        "title_degree": "Computer Engineering"
    }
    ```
- GET `/api/teacher/details`
    - This API requires authentication as a teacher, it will return the details about the logged in teacher in a form such as
    ```json
    {
        "surname": "FASANA",
        "name": "SARA",
        "email": "fasana.sara@polito.it",
        "group_name": "Group 1 - DAD",
        "department_name": "Dipartimento Interateneo di Scienze, progetto e politiche del Territorio",
        "department_short_name": "DIST"
    }
    ```
- GET `/api/teacher/ApplicationsList`
    - This API accepts no parameters, it will return an array of applications for the current teacher.

        An example response:
    ```json
    [
        {
            "id": 5,
            "student_id": 4,
            "proposal_id": 706,
            "apply_date": "2023-11-10T23:00:00.000Z",
            "status": false,
            "thesis_title": "La chiesa di Santo Stefano al Monte presso Candia Canavese. Dal rilievo con sistemi LIDAR alla manutenzione programmata.",
        }
    ]
    ```
- GET `/api/teacher/applicationDetail/<applicationid>`
    - This API accepts a parameter being an application id and will return the details of the application with that id.

        An example response:
    ```json
    {
        "thesis_title": "La chiesa di Santo Stefano al Monte presso Candia Canavese. Dal rilievo con sistemi LIDAR alla manutenzione programmata.",
        "student_id": 4,
        "student_name": "Maria",
        "student_surname": "Ferrari",
        "application_date": "2023-11-10T23:00:00.000Z",
        "student_gender": "F",
        "student_nationality": "Italian",
        "student_email": "maria.ferrari@studenti.polito.it",
        "student_carrer": "Master Degree in Management Engineering",
        "student_ey": "2021-09-30T22:00:00.000Z"
    }
    ```

- GET `/api/student/ApplicationsList`
    - This API accepts no parameters, it will return an array of applications for the current student.
    
        An example response:
        ```json
        [
            {
                "id": 5,
                "student_id": 4,
                "proposal_id": 706,
                "apply_date": "2023-11-10T23:00:00.000Z",
                "status": false,
                "thesis_title": "La chiesa di Santo Stefano al Monte presso Candia Canavese. Dal rilievo con sistemi LIDAR alla manutenzione programmata.",
                "teacher_name": "SARA",
                "teacher_surname": "FASANA",
                "teacher_email": "fasana.sara@polito.it"
            },
            {
                "id": 6,
                "student_id": 4,
                "proposal_id": 532,
                "apply_date": "2023-11-10T23:00:00.000Z",
                "status": false,
                "thesis_title": "Microprocessor-based Self Test for on-line testing of airplane electronic system",
                "teacher_name": "LUCA",
                "teacher_surname": "STERPONE",
                "teacher_email": "sterpone.luca@polito.it"
            },
            {
                "id": 7,
                "student_id": 4,
                "proposal_id": 1264,
                "apply_date": "2023-11-10T23:00:00.000Z",
                "status": false,
                "thesis_title": "Quanto sono veloci i computer quantistici?",
                "teacher_name": "DAVIDE",
                "teacher_surname": "GIROLAMI",
                "teacher_email": "girolami.davide@polito.it"
            }
        ]
        ```
- POST `/api/teacher/insertProposal`
    - This API accepts a JSON object with the following structure:
    ```json
    {
        "title": "<thesis title>",
        "supervisor": "<supervisor email>",
        "co_supervisor": ["<co-supervisor 1 email>", "<co-supervisor 2 email>"], // array of co-supervisors emails, can be empty
        "keywords": ["<keyword 1>", "<keyword 2>"], // array of keywords, cannot be empty
        "type": "<thesis type>", // type of thesis
        "description": "<thesis description>",
        "required_knowledge": ["<required knowledge 1>", "<required knowledge 2>"], // array of required knowledge, can be empty
        "notes": "<notes>", // notes, can be empty
        "expiration": "<expiration date>", // expiration date
        "level": "<thesis level>", // thesis level, can be 1 or 2
        "programmes": ["<programme 1>", "<programme 2>"], // array of programmes, cannot be empty
    }
    ```
    - This API will insert a new proposal in the database and return the entire proposal with the id given to it by the database.
        
    Example request:
    ```json
    {
        "title": "test title",
        "supervisor": "fasana.sara@polito.it",
        "co_supervisor": [],
        "keywords": ["python", "coding"],
        "type": "Tesi di laurea",
        "groups": ["Aa - Glasses","Ceramics And Composites"],
        "description": "test description",
        "required_knowledge": ["python"],
        "notes": "Avere pycharm è consigliato",
        "expiration": "2024-11-02",
        "level": 2,
        "programmes": ["LM-17 - Master Degree in Physics"]
    }
    ```
        
    Example response:
    
    ```json
    {
        "id": 1500,
        "title": "test title",
        "teacher_id": 20,
        "supervisor": "fasana.sara@polito.it",
        "co_supervisor": [],
        "keywords": [
            "python",
            "coding"
        ],
        "type": "Tesi di laurea",
        "groups": [
            "Aa - Glasses",
            "Ceramics And Composites"
        ],
        "description": "test description",
        "required_knowledge": [
            "python"
        ],
        "notes": "Avere pycharm è consigliato",
        "expiration": "2024-11-01T23:00:00.000Z",
        "level": 2,
        "programmes": [
            "LM-17 - Master Degree in Physics"
        ],
        "archived": false
    }
    ```
- POST `/api/student/applyRequest/<thesisid>`
    - This API accepts a JSON object with the following structure:
    ```json
    {
        "title": "<thesis title>",
        "description": "<thesis description>",
        "supervisor": "<supervisor email>",
        "co_supervisor": ["<co-supervisor 1 email>", "<co-supervisor 2 email>"], // array of co-supervisors emails, can be empty
        "apply_date": "<apply request date>", // apply a new request date
    }
    ```
    - This API will insert a new thesis requeset in the database and return the entire details of request in the database.
    
    Example request:
    ```json
    {
        "title": "test title",
        "supervisor": "morisio.maurizio@polito.it",
        "co_supervisor": [],
        "description": "test description",
        "apply_date": "2023-08-26"
    }
    ```
    Example response:
    ```json
    {
        "id": 17,
        "student_id": 7,
        "proposal_id": 22,
        "title": "test title",
        "description": "test description",
        "supervisor": "morisio.maurizio@polito.it",
        "co_supervisor": [],
        "apply_date": "2024-08-25T23:00:00.000Z",
        "status_clerk": null,
        "status_teacher": null,
        "comment": null,
        "approval_date": null
    }
    ```
- GET `/api/student/RequestList`
    - This API will return all the thesis requests made by the student currently logged in. It returns a list of thesis requests in the form:
    ```json
        {
        "id": <id of the request>,
        "student_id": <id of a student>,
        "proposal_id": <id of a proposal>,
        "title": "<title of the thesis>",
        "description": "<explanation of the thesis>",
        "supervisor": "<email of the supervisor>",
        "co_supervisor": "<email of the co-supervisor>", //could be empty
        "apply_date": "<apply request date>", // date of the request applied
        "comment": "<comment of the teacher>",
        "status_clerk": null,  //status evaluated by clerk
        "status_teacher": null, //status evaluated by teacher, is a number, 0 for pending, 1 for accepted, 2 for change request, 3 for rejected
        "approval_date": null //approval date of a request, it can be true only with 'status_teacher' and 'status_clerk' are both true.
    },
    ```
- PATCH `/api/student/Requestlist/<requestid>`
    - This API is used to update a thesis request to address a teacher's comment. It accepts a JSON object with the following structure:
    ```json
    {
        "title": "<thesis title>",
        "description": "<thesis description>",
        "co_supervisor": ["<co-supervisor 1 email>", "<co-supervisor 2 email>"], // array of co-supervisors emails, can be empty
    }
    ```
    Following this request, the request will be updated with the given parameters, the status will be reset to 0 (pending) and the teacher's comment will be reset to null.
    It also returns the updated request in the same format as the one returned by `/api/student/RequestList`.

- GET `/api/student/AcceptedApplicationsPropList`
    - This API is used to get the list of proposals associated with accepted applications for the current student.
    - It returns a list of proposals in the same format as the one returned by `/api/ProposalsList`.

- GET `/api/clerk/Requestlist`
    - This API will return all the requests need to be evaluated by cletk in the database, it expects no parameters. It returns a list of thesis requests in the form:
    ```json
        {
        "id": <id of the request>,
        "student_id": <id of a student>,
        "proposal_id": <id of a proposal>,
        "title": "<title of the thesis>",
        "description": "<explanation of the thesis>",
        "supervisor": "<email of the supervisor>",
        "co_supervisor": "<email of the co-supervisor>", //could be empty
        "apply_date": "<apply request date>", // date of the request applied
        "comment": "<comment of the teacher>",
        "status_clerk": null,  //status evaluated by clerk
        "status_teacher": null, //status evaluated by teacher
        "comment": null,  // Professor's comment for asking students to change their requests
        "approval_date": null //approval date of a request, it can be true only with 'status_teacher' and 'status_clerk' are both true.
    },
    ```

- PATCH `/api/clerk/Requestlist/:requestid`
    - This API will update the status of a request by clerk. When it successes, it will return all the details of the request in the database.
    Example request:
    ```json
    {
        "status_clerk" : true
    }
    ```
   Example response:
    ```json
    {
        "id": 17,
        "student_id": 7,
        "proposal_id": 22,
        "title": "test title",
        "description": "test description",
        "supervisor": "morisio.maurizio@polito.it",
        "co_supervisor": [],
        "apply_date": "2024-08-25T23:00:00.000Z",
        "status_clerk": true,
        "status_teacher": null,
        "comment": null,
        "approval_date": null
    }
    ```

- GET `/api/teacher/Requestlist`
    - This API will return all the requests that have been accepted by clerk and need to be evaluated by corresponding professor in the database, it expects no parameters. It returns a list of thesis requests of a specific professor in the form:
    ```json
        {
        "id": <id of the request>,
        "student_id": <id of a student>,
        "proposal_id": <id of a proposal>,
        "title": "<title of the thesis>",
        "description": "<explanation of the thesis>",
        "supervisor": "<email of the supervisor>",
        "co_supervisor": "<email of the co-supervisor>", //could be empty
        "apply_date": "<apply request date>", // date of the request applied
        "status_clerk": true,  //status evaluated by clerk
        "status_teacher": null, //status evaluated by teacher
        "comment": null,  // Professor's comment for asking students to change their requests
        "approval_date": null //approval date of a request, it can be true only with 'status_teacher' and 'status_clerk' are both true.
    },
    ```

- PATCH `/api/teacher/Requestlist/:requestid`
    - This API will update the status of a request by professor. When it successes, it will return all the details of the request in the database.
    Example request:
    ```json
    {
        "status_teacher" : 3
    }
    ```
   Example response:
    ```json
    {
        "id": 17,
        "student_id": 7,
        "proposal_id": 22,
        "title": "test title",
        "description": "test description",
        "supervisor": "morisio.maurizio@polito.it",
        "co_supervisor": [],
        "apply_date": "2024-08-25T23:00:00.000Z",
        "status_clerk": true,
        "status_teacher": 3,
        "comment": null,
        "approval_date": null
    }
    ```

- PATCH `/api/teacher/Requestlist/:requestid/comment`
    - This API will update the comment of a request by professor. When it successes, it will return all the details of the request in the database.
    Example request:
    ```json
    {
        "comment" : "Your description need to have more details."
    }
    ```
   Example response:
    ```json
    {
        "id": 17,
        "student_id": 7,
        "proposal_id": 22,
        "title": "test title",
        "description": "test description",
        "supervisor": "morisio.maurizio@polito.it",
        "co_supervisor": [],
        "apply_date": "2024-08-25T23:00:00.000Z",
        "status_clerk": true,
        "status_teacher": 3,
        "comment": "Your description need to have more details.",
        "approval_date": null
    }
    ```

- GET `/api/ProposalsList`
    - This API will return all the thesis proposals inserted in the database, it expects no parameters. It returns a list of thesis proposals in the form:
    ```json
      {
        "id": <id>,
        "title": "<title of the thesis>",
        "teacher_id": <id of the teacher>,
        "supervisor": "<email of the supervisor>",
        "co_supervisor": [
           "<email of the co-supervisor>" 
        ],
        "keywords": [
            "<keyword>",
        ],
        "type": "<type of the thesis>",
        "groups": [
            "<group>"
        ],
        "description": "<explanation of the thesis>",
        "required_knowledge": [
            "<requirement>"
        ],
        "notes": "<notes>",
        "expiration": "<timestamp of expiration>",
        "level": <level>,
        "programmes": [
            "<programme>"
        ],
        "teacher_name": "<teacher name>",
        "teacher_surname": "<teacher surname>"
    },
    ```
- GET `/api/proposal/<proposalid>`
    - This API will return the details of the given proposal id, in the same format as the one returned by `/api/ProposalsList`.
- GET `/api/ProposalsList/filter`
    - This API will return all the thesis proposals that match the given filters, it expects a json object of type:
    ```json
    {
        "title": "<title>",
        "professor": <professor id as integer>,
        "date": "<date>",
        "type": ["<type 1>", "<type 2>"],
        "keywords": ["<keyword 1>", "<keyword 2>"],
        "level": <1 or 2 (1 for Bachelor and 2 for Masters)>,
        "groups": ["<group 1>", "<group 2>"],
    }
    ```
    All the fields are **optional**, if a field is not specified it will not be used as a filter.
    The returned object is a list with objects of the same shape as the ones returned by `/api/ProposalsList` (the above).
- GET `/api/teacher/list`
    - This API will return all the teachers in the database in the form:
    ```json
    {
        "name": "DANIEL",
        "surname": "MILANESE",
        "id": 1
    },
    {
        "name": "BARBARA",
        "surname": "ONIDA",
        "id": 2
    },
    ...
    ```
- POST `/api/teacher/retrieveCosupGroup`
    - This API accepts a json object of the form
    ```json
    {
        "cosup_emails": ["<email of the co-supervisors>", ...]
    }
    ```
    - It will return a list of groups that contain all the co-supervisors in the given list.
    ```json
    [
        "group1", "group2", ...
    ]
    ```
- DELETE `/api/teacher/deleteProposal`
    - This API accepts a json object of the form
    ```json
    {
        "proposalId": <id of the proposal>
    }
    ```
    - It will delete the proposal with the given id from the database.
    - It will return 400 if the proposal has been already assigned to a student and 500 if email notifications fail.
- GET `/api/thesis/types`
    - This API will return all the unique thesis types in the database, as a list of strings.
    ```json
    [
        "SIMULATIVA E SPERIMENTALE",
        "RICERCA APPLICATA",
        "DI RICERCA, PROGETTAZIONE"
        ...
    ]
    ```
- GET `/api/thesis/keywords`
    - This API will return all the unique thesis keywords in the database, as a list of strings.
    ```json
    [
        "CARATTERIZZAZIONE MAGNETICA",
        "RILIEVO GEOSTRUTTURALE",
        "tesi vuole esaminare e confrontare alcune",
        "MUSCLE POWER",
        "IMMAGINI DIGITALI",
        "STRUTTURE TRABECOLARI",
        "SIMULAZIONI"
        ...
    ]
    ```
- GET `/api/thesis/groups`
    - This API will return all the unique thesis groups in the database, as a list of strings.
    ```json
    [
        "Microwaves And Optoelectronics Group",
        "Centro Interdipartimentale Cars",
        "Aa - Materiali Ceramici",
        "16-Astra: Additive Manufacturing For Systems And Structures In Aerospace",
        "L-15 group 1"
        ...
    ]
    ```
- POST `/api/student/applyProposal`
    - This API will accept a FORM-DATA object with the following structure:
    ```json
    {
        "student_id": <student id>,
        "proposal_id": <proposal id>,
        "apply_date": <YYYY-MM-DD>,
        "file": <optional binary blob containing the submitted file by the student>
    }
    ```
    - It adds in the database the application of the student to the proposal.
    - It returns the application object:
    ```json
    {
        "id": <id>,
        "student_id": <student id>,
        "proposal_id": <proposal id>,
        "apply_date": <YYYY-MM-DD>,
        "status": <boolean>
    }
    ```
- POST `/api/student/ProposalsList`
    - This API requires a json body with the structure:
    ```json
    {
        "cod_degree": "<cod_degree>",
    }
    ```
    - It will return the list of proposals for the student with the given cod_degree.
- PUT `/api/teacher/updateProposal/<thesisid>`
    - This API requires a json body with the structure:
    ```json
    {
        "title": "<thesis title>",
        "supervisor": "<supervisor email>",
        "co_supervisor": ["<co-supervisor 1 email>", "<co-supervisor 2 email>"], // array of co-supervisors emails, can be empty
        "keywords": ["<keyword 1>", "<keyword 2>"], // array of keywords, cannot be empty
        "type": "<thesis type>", // type of thesis
        "description": "<thesis description>",
        "required_knowledge": ["<required knowledge 1>", "<required knowledge 2>"], // array of required knowledge, can be empty
        "notes": "<notes>", // notes, can be empty
        "expiration": "<expiration date>", // expiration date
        "level": "<thesis level>", // thesis level, can be 1 or 2
        "programmes": ["<programme 1>", "<programme 2>"], // array of programmes, cannot be empty
    }
    ```
    - This API will update the proposal with the given id with the given parameters. It will return the ID of the updated proposal.
- GET `/api/teacher/ProposalsList`:
    - This API will return a list of all active and archived proposals in the following format:
    ```json
      {
        "active": [
            {
                "id": <id>,
                "title": "<title of the thesis>",
                "teacher_id": <id of the teacher>,
                "supervisor": "<email of the supervisor>",
                "co_supervisor": [
                "<email of the co-supervisor>" 
                ],
                "keywords": [
                    "<keyword>",
                ],
                "type": "<type of the thesis>",
                "groups": [
                    "<group>"
                ],
                "description": "<explanation of the thesis>",
                "required_knowledge": [
                    "<requirement>"
                ],
                "notes": "<notes>",
                "expiration": "<timestamp of expiration>",
                "level": <level>,
                "programmes": [
                    "<programme>"
                ],
                "archived": <boolean>
            },
            ...
        ],
        "archived": [
            {
                "id": <id>,
                "title": "<title of the thesis>",
                "teacher_id": <id of the teacher>,
                "supervisor": "<email of the supervisor>",
                "co_supervisor": [
                "<email of the co-supervisor>" 
                ],
                "keywords": [
                    "<keyword>",
                ],
                "type": "<type of the thesis>",
                "groups": [
                    "<group>"
                ],
                "description": "<explanation of the thesis>",
                "required_knowledge": [
                    "<requirement>"
                ],
                "notes": "<notes>",
                "expiration": "<timestamp of expiration>",
                "level": <level>,
                "programmes": [
                    "<programme>"
                ],
                "archived": <boolean>
            },
            ...
        ]
      }
    ```
- PATCH `/api/teacher/ProposalsList/<proposalid>`
    - No parameters, this api will archive or unarchive the proposal with the given id.
    - It returns the entire proposal object
- GET `/api/teacher/getGeneratedCV/<applicationid>`
    - This API will return the generated CV for the given application id.
    - It returns a binary blob containing the CV as a PDF.
- GET `/api/teacher/getSubmittedCV/<applicationid>`
    - This API will return the submitted CV for the given application id, if any.
    - It returns a binary blob containing the CV if it exists, returns 404 otherwise, the file can be of any type.
- GET `/api/virtualclock`
    - This API will return the timestamp (with time zone) of the virtual clock:
    ```json
    {
        "date": <YYYY-MM-DD HH:mm::ss TZ>
    }
    ```
- POST `/api/virtualclock`
    - This API will accept a JSON object with the following structure:
    ```json
    {
        "date": <YYYY-MM-DD>
    }
    ```
    - It will set the date of the virtual clock to the given date.
    - It returns the date of the virtual clock:
    ```json
    {
        "date": <YYYY-MM-DD>
    }
    ```
- DELETE `/api/virtualclock`
    - This API will reset the date of the virtual clock to the current date.
    - It returns the date of the virtual clock:
    ```json
    {
        "date": <YYYY-MM-DD>
    }
    ```
- POST `/api/send_email`
    - This API will accept a JSON object with the following structure:
    ```json
    {
        "recipient_email": "<email of the recipient>",
        "subject": "<subject of the email>",
        "message": "<text of the email>"
    }
    ```
    - It will send an email to the given recipient with the given subject and text.
    - It returns a string detailing the result of the operation.

- GET `/api/cosup/ProposalsList`
    - No parameters, this api return an array with all the active co-supervised proposal of the current logged in teacher.
    - Each element of the array is an entire proposal object 