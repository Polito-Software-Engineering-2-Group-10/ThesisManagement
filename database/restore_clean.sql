drop schema public cascade;
drop database if exists thesismanagement;
drop user if exists thesismanager;
create schema public authorization postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;