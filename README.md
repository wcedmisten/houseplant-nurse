# Houseplant Nurse

Houseplant Nurse is a website for finding information on how to properly care for many different species of houseplants.

This website is a visualization of the data found here: https://extension.uga.edu/publications/detail.html?number=B1318&title=Growing%20Indoor%20Plants%20with%20Success.

## Prerequisites

[Docker](https://docs.docker.com) docker engine

[Docker-Compose](https://docs.docker.com/compose/) to orchestrate database and webapp Docker images


## Installation

This will build two Docker images:

* `webapp`, which runs the backend Golang logic, and serves the frontend React client
* `plant_db`, which runs a dedicated Postgres database used to query houseplant data

```bash
docker-compose build
```

## Usage

This will serve the webapp on port 5000. You can visit the page in your browser at localhost:5000

```bash
docker-compose up
```

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Screenshots

![Screenshot of the main page](screenshots/screenshot-main.png?raw=true)

![Screenshot of search feature](screenshots/search.png?raw=true)