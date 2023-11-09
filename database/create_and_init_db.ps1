param(
    [Parameter(Mandatory=$true)][securestring]$PsqlPassword
)

$version = (Get-ChildItem -Path "C:\Program Files\PostgreSQL").Name

$env:PATH = "C:\Program Files\PostgreSQL\$version\bin;C:\Program Files\PostgreSQL\$version\lib;" + $env:PATH

$plainPsqlPass = ConvertFrom-SecureString $PsqlPassword -AsPlainText

$pgPass = "localhost:5432:postgres:postgres:$plainPsqlPass"
$oqmPass = "localhost:5432:thesismanagement:thesismanager:thesismanager"
$allPass = $pgPass + "`n" + $oqmPass

$env:PGPASSFILE = "$pwd\.pgpass"

Out-File -FilePath .pgpass -InputObject $allPass
$env:PGCLIENTENCODING = "UTF8"
chcp 65001
psql -U postgres -f .\restore_clean.sql
psql -U postgres -f .\create_user_and_db.sql
psql -U thesismanager -d thesismanagement -f .\create_tables.sql
psql -U thesismanager -d thesismanagement -f .\init_data.sql

Remove-Item -Path .pgpass