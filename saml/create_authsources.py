import asyncpg
import asyncio
import argparse

prelude = """<?php
$config = array(
    'admin' => array(
        'core:AdminPassword',
    ),

    'example-userpass' => array(
        'exampleauth:UserPass',
"""

postlude = """
    ),

);"""

format_entry = \
"""
        '{0}:{1}' => array(
            'email' => '{0}',
            'role' => '{2}',
        ),
"""

async def create_authsources(conn: asyncpg.Connection):
    teachers = await conn.fetch('SELECT id, email FROM teacher')
    students = await conn.fetch('SELECT id, email FROM student')
    merged = teachers + students
    with open('/var/www/simplesamlphp/config/authsources.php', 'w') as f:
        f.write(prelude)
        for u in teachers:
            f.write(format_entry.format(u['email'], u['id'], 'teacher'))
        for u in students:
            f.write(format_entry.format(u['email'], u['id'], 'student'))
        f.write(postlude)

argparser = argparse.ArgumentParser()
argparser.add_argument('--host', default='127.0.0.1')
argparser.add_argument('-p', '--port', default='5432')
args = argparser.parse_args()
async def main():
    try:
        c = await asyncpg.connect(
            user='thesismanager', password='thesismanager', database='thesismanagement', host=args.host, port=args.port
        )
        await create_authsources(c)
        print("Created authsources.php")
    except Exception as e:
        print(e)
        exit(1)

asyncio.run(main())