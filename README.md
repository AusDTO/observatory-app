# Observatory-service

Repoistory for the Beta of the analytics reporting tool.

## Server

Stack:

- Graphql (Appolo)
- Postgres, using Typeorm as the ORM
- Redis for in memoryDb
- Express for admin api

Follow the instructions to start the app locally.

### Environment variable

Add a `.env` in the root directory. A notify key is required for the email functionality.

```
NOTIFY_DEV_KEY=
NOTIFY_TEST_KEY=
```

Although you could probably get away with out a notify key by mocking the send confirmation behaviour in the `util/sendConfirmationEmail`

### Redis

Download redis from the [doc site](https://redis.io/download). Mac users may run `brew install redis`.

First start the redis server on port 6379

`$ redis-server --port 6379`

**Optional:** once the server has started, you can use the redis-cli in another terminal window.

`$ redis-cli -p 6379`

### Postgres

Download postgres from here and make sure it's running locally
https://www.postgresql.org/download/

## Start server

Once this is done run the following commands from the `/server` directory to start the server:

```
$ npm i
$ npm run watch
```

It will start on port 4000 by default.
