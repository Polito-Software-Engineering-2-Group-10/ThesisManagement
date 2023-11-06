## This guide assumes that you have a working installation of PostgreSQL
1. Open a terminal in this folder
2. Run `psql -U postgres` to enter the PostgreSQL shell, you might need to add the path to the bin folder of your PostgreSQL installation to your PATH environment variable ([guide if you don't know how to do it](https://stackoverflow.com/questions/30401460/postgres-psql-not-recognized-as-an-internal-or-external-command)).
2. Run `\i create_user_and_db.sql` to create the user and database
3. Run `\c officequeuemanager` to connect to the database
4. Run `\i create_tables.sql` to create the tables

Alternatively you can try using PGAdmin (the GUI for PostgreSQL) to run the sql scripts but I find it easier to use the shell.


