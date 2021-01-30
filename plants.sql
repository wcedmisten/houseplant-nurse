CREATE TABLE plant_data (id varchar primary key, scientific_name varchar, common_name varchar, light varchar, temperature varchar, humidity varchar, watering varchar, soil varchar);

\copy plant_data FROM 'plant_care_data.csv' delimiter ',' CSV HEADER ;

/* update the trigram extension for search via similiarity() */
create extension pg_trgm;