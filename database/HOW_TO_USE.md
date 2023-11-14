# Steps to create the database
## If you are on Windows and have [powershell 7 and onwards](https://learn.microsoft.com/it-it/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3), you can use the provided powershell script `create_and_init_db.ps1`.
This script will automatically drop the database and user if they exist already, and recreate everything inserting the data.

The script is called like so `.\create_and_init_db.ps1` in a powershell terminal opened in this folder.

It will ask you for your postgres password, and then it will create the database and the user, deleting existing ones if present, and populate the database with the data.

## This guide assumes that you have a working installation of PostgreSQL
1. Open a terminal in this folder
2. Run `psql -U postgres` to enter the PostgreSQL shell, you might need to add the path to the bin folder of your PostgreSQL installation to your PATH environment variable ([guide if you don't know how to do it](https://stackoverflow.com/questions/30401460/postgres-psql-not-recognized-as-an-internal-or-external-command)).
2. Run `\i create_user_and_db.sql` to create the user and database
3. Run `\c thesismanagement` to connect to the database
4. Run `\i create_tables.sql` to create the tables

Alternatively you can try using PGAdmin (the GUI for PostgreSQL) to run the sql scripts but I find it easier to use the shell.


## Populate the database

In order to add the data to the database you can run (all these commands are to be executed in the PostgreSQL shell, after having logged in with `psql -U postgres -d thesismanagement`):

```postgresql
\i init_data.sql
\i thesis_data_raw.sql
```

To remove the data from the database you can run:

```postgresql
\i clear_data.sql
```

To remove the database (to run this command you need to be in the PostgreSQL shell with this command `psql -U postgres` so it doesn't connect to the database and thus it can be dropped):

```postgresql
\i restore_clean.sql
```
