CREATE TABLE plant_data (id varchar primary key, scientific_name varchar, common_name varchar, light varchar, temperature varchar, humidity varchar, watering varchar, soil varchar);

\copy plant_data FROM 'plant_care_data.csv' WITH (FORMAT csv);