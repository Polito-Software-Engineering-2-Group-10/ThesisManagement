#!/bin/bash

# script made for unix based machines for the setup
# of the postgresSQL environment.

# the password for PSQL 
read -s psqlpassword

# setup file .pgpass
pgpass="localhost:5432:postgres:postgres:$psqlpassword
localhost:5432:thesismanagement:thesismanager:thesismanager"
echo -e "$pgpass" > ~/.pgpass
chmod 0600 ~/.pgpass

# setup encoding 
export PGCLIENTENCODING=UTF8

# run the SQL scripts
psql -U postgres -f restore_clean.sql
psql -U postgres -f create_user_and_db.sql  
psql -U thesismanager -d thesismanagement -f create_tables.sql
psql -U thesismanager -d thesismanagement -f init_data.sql
psql -U thesismanager -d thesismanagement -f testing_data.sql

# removes .pgpass
rm ~/.pgpass
