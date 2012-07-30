select 
'{"type":"FeatureCollection","features":['||array_to_string(array_agg('{"type":"Feature","id":"Vector_'||gid||'","properties":{"code":"'||code||'","label":"'||label||'"},"geometry":'||st_asgeojson(the_geom,6)||'}'),',')||']}'
from building