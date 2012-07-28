# Connection settings
export PG_HOST='localhost'
export PG_PORT='54321'

# Relying on local connection for now
export DBLOAD_USERNAME=''
export DBLOAD_PASSWORD=''


# Sample database creation - should be performed by a super user
# CREATE DATABASE sample WITH ENCODING='UTF8' TEMPLATE=template_postgis CONNECTION LIMIT=-1;
# Syntax might me different on PostGIS 2.x / PostgreSQL 9.x as no dedicated template is required

# Removing previous log
rm log.txt

# List of ordered SQL commands to execute
psql -h $PG_HOST -p $PG_PORT -f './MelbourneUni/ddl.sql' sample > log.txt
psql -h $PG_HOST -p $PG_PORT -f './MelbourneUni/inserts.sql' sample >> log.txt
