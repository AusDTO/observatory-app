# Observatory-service

Repository for the Alpha phase of the Observatory analytics reporting tool.

### Contents

- [Server](#server)
- [Client](#client)

## Server

Stack:

- Graphql (Apollo)
- Postgres, using TypeORM as the ORM
- Redis for In-memory database
- Express for admin API
- [Notify.gov.au](https://notify.gov.au/) for email service

Follow the instructions to start the app locally.

### Environment variable

Add a `.env` to the root directory. A notify key is required for email functionality.

```
NOTIFY_DEV_KEY=
NOTIFY_TEST_KEY=
```

Although you could probably get away with out a notify key by mocking the send confirmation behaviour in the `util/sendConfirmationEmail`

### Redis

Download Redis from the [doc site](https://redis.io/download). Mac users may run `brew install redis`.

Firstly, start the Redis server on port 6379:

`$ redis-server --port 6379`

**Optional:** once the server has started, you can use the redis-cli in another terminal window.

`$ redis-cli -p 6379`

### Postgres

Download Postgres from here and make sure it's running locally:
https://www.postgresql.org/download/

### Start server

Once Postgres is running, run the following commands from the `/server` directory to start the server:

```
$ npm i
$ npm run watch
```

It will start on port 4000 by default.

## Client

Stack:

- Create React App
- Apollo client
- [Design System](https://designsystem.gov.au/)

Once server is up and running, run the following in the `/client` directory:

```
$ npm i
$ npm run watch
```
