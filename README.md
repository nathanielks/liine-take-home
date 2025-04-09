# Liine take home assessment

Hi, Liine hiring team! In this repo you will find my solution for returning a list of restaurant names that are open for a given datetime string.

## Getting Started

To run this on your machine, ensure you have [`docker-compose`](https://docs.docker.com/compose/install/) installed. After you have downloaded this repo and `cd`'d into it, run:

```sh
docker-compose up
```

This will start a server on `localhost:3000`. It will ingest [`restaurants.csv`](restaurants.csv) into a database on boot. You can make queries against `http://localhost:3000/restaurants` like so:

```sh 
curl http://localhost:3000/restaurants\?datetime=2025-04-09T18:59:36
```

## Notable files
 
- [`/src/routes/restaurants/index.ts`](src/routes/restaurants/index.ts): route definition for `/restaurants` and where the query logic resides.
- [`/src/parser/index.ts`]: the file where the parsing logic is located.
- [`/test/parser/index.test.ts`](test/parser/index.test.ts): the unit test file for testing parsing of the CSV file.
