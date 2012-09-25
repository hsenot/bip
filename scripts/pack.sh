cd /opt/data
rm australia.osm.bz2
wget http://download.geofabrik.de/osm/australia-oceania/australia.osm.bz2

rm -R pgsqldump
mkdir pgsqldump

cd /opt/osm/osmosis/package/bin
bzcat /opt/data/australia.osm.bz2 | ./osmosis --read-xml file=- --tf accept-ways 'building=*' --used-node --write-pgsql-dump directory=/opt/data/pgsqldump

cd /opt/data
rm buildings.tar.gz
tar -zcvpf buildings.tar.gz ./pgsqldump
rm /usr/share/apache2/bip/data/PGDUMP/buildings.tar.gz
mv buildings.tar.gz /usr/share/apache2/bip/data/PGDUMP/
