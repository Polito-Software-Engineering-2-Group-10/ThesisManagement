-- Create the user if it doesn't exists:
DO
$do$
BEGIN
IF EXISTS (
    SELECT FROM pg_catalog.pg_roles
    WHERE rolname = 'thesismanager') THEN

    RAISE NOTICE 'User thesismanager already exists.';
ELSE
    CREATE ROLE thesismanager WITH
    LOGIN
    NOSUPERUSER
    INHERIT
    CREATEDB
    NOCREATEROLE
    NOREPLICATION
    PASSWORD 'thesismanager';
END IF;
END
$do$;

-- Create the database:
CREATE DATABASE thesismanagement
    WITH OWNER = thesismanager
    ENCODING = 'UTF8'
    TABLESPACE = pg_default;