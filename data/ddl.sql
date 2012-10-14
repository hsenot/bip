-- Database: bip

-- DROP DATABASE bip;

CREATE DATABASE bip
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       LC_COLLATE = 'C'
       LC_CTYPE = 'C'
       CONNECTION LIMIT = -1;


-- Table: building

-- DROP TABLE building;

CREATE TABLE building
(
  osm_id integer NOT NULL,
  "name" character varying(128),
  built_year character(4),
  height_above_ground_floors integer,
  height_above_ground_m integer,
  photo_url character varying,
  CONSTRAINT building_pk PRIMARY KEY (osm_id)
);


-- Table: project_type

-- DROP TABLE project_type;

CREATE TABLE project_type
(
  code integer NOT NULL,
  label character varying(128),
  CONSTRAINT project_type_pk PRIMARY KEY (code)
);



-- Table: project

-- DROP TABLE project;

CREATE TABLE project
(
  id serial NOT NULL,
  description text,
  "cost" numeric(10,2),
  payback_period numeric(5,2),
  yearly_emission_reduction_t numeric(8,2),
  "type" integer,
  CONSTRAINT project_pk PRIMARY KEY (id),
  CONSTRAINT project_type_fk FOREIGN KEY ("type")
      REFERENCES project_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Index: fki_project_type_fk

-- DROP INDEX fki_project_type_fk;

CREATE INDEX fki_project_type_fk
  ON project
  USING btree
  (type);


-- Table: building_project

-- DROP TABLE building_project;

CREATE TABLE building_project
(
  id_building integer NOT NULL,
  id_project integer NOT NULL,
  CONSTRAINT building_project_pk PRIMARY KEY (id_building, id_project),
  CONSTRAINT building_project_building_fk FOREIGN KEY (id_building)
      REFERENCES building (osm_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT building_project_project_fk FOREIGN KEY (id_project)
      REFERENCES project (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX fki_building_project_project_fk
  ON building_project
  USING btree
  (id_project)
  
CREATE INDEX fki_building_project_building_fk
  ON building_project
  USING btree
  (id_building)  


