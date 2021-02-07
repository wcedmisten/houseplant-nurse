FROM postgres:12

COPY ./plant_care_data.csv .

# postgres docker image runs these scripts on startup. Used to import the csv data.
COPY ./plants.sql /docker-entrypoint-initdb.d/