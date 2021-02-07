# Houseplant Nurse

Houseplant Nurse is a website for finding information on how to properly care for many different species of houseplants.

This website is a visualization of the data found here: https://extension.uga.edu/publications/detail.html?number=B1318&title=Growing%20Indoor%20Plants%20with%20Success.

## Prerequisites

[Yarn](https://yarnpkg.com/) package manager

[Docker](https://docs.docker.com) docker engine to run a containerized postgres

## Installation

Node Package Manager (npm) and yarn are required to build this project. Go is also required to run the backend.

```bash
cd client/
yarn build
```

## Usage

```bash
# build the postgres image containing the houseplant data:
docker build -t plant_db .
# run the docker image and port-forward the necessary ports for postgres
# NOTE: change the password if running this outside of a private development environment
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password plant_db

# in a new terminal or tab
# build the React client with yarn:
cd client/
yarn build

cd ..
# run the Golang backend
go run main.go
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
