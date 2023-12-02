<?php

$config = array(
    'admin' => array(
        'core:AdminPassword',
    ),

    'example-userpass' => array(
        'sqlauth:SQL',
        'dsn' => 'pgsql:host=db;port=5432;dbname=thesismanagement',
        'username' => 'thesismanager',
        'password' => 'thesismanager',
        'query' => 'SELECT id, email, \'teacher\' as role FROM teacher WHERE email = :username AND id = :password UNION ALL SELECT id, email, \'student\' as role FROM student WHERE email = :username AND id = :password',
    )
);
