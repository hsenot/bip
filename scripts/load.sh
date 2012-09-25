rm buildings.tar.gz

wget http://app.carbongis.com.au/bip/data/PGDUMP/buildings.tar.gz

tar -xvf buildings.tar.gz

sudo -u postgres psql -d buildinggis -f queries.sql
