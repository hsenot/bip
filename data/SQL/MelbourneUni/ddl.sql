-- Table drop
DROP TABLE building CASCADE;
DELETE FROM geometry_columns WHERE f_table_name='building';


-- Table structure
CREATE TABLE building (
    gid integer NOT NULL,
    label character varying(80),
    code integer,
    the_geom geometry,
    CONSTRAINT enforce_dims_the_geom CHECK ((st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((st_srid(the_geom) = 4326))
);

-- Other Constraints
ALTER TABLE ONLY building ADD CONSTRAINT building_pkey PRIMARY KEY (gid);

-- Sequence
CREATE SEQUENCE building_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

ALTER SEQUENCE building_gid_seq OWNED BY building.gid;

SELECT pg_catalog.setval('building_gid_seq', 1, true);

ALTER TABLE building ALTER COLUMN gid SET DEFAULT nextval('building_gid_seq'::regclass);

-- Insert into geometry_columns
INSERT INTO geometry_columns (f_table_catalog, f_table_schema, f_table_name, f_geometry_column, coord_dimension, srid, type) VALUES ('', 'public', 'building', 'the_geom', 2, 4283, 'POLYGON');


