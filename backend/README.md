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