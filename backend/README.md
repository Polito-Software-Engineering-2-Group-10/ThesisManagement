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