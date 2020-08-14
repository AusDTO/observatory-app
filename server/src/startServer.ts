import "reflect-metadata";
import * as express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { connection } from "./util/createConnection";
import { loadFilesSync } from "@graphql-tools/load-files";
import * as path from "path";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { DocumentNode } from "graphql";
import Redis from "ioredis";
import { confirmEmail } from "./routes/confirmEmail";
import * as session from "express-session";
import * as connect_redis from "connect-redis";
import "dotenv/config";
import { FRONT_END_URL, REDIS_PREFIX } from "./util/constants";
import * as rateLimit from "express-rate-limit";
import * as RedisRateLimitStore from "rate-limit-redis";

const PORT: number | string = process.env.PORT || 4000;

const RedisStore = connect_redis(session);

const REDIS_PORT = 6379;

export const startServer = async () => {
  const redis_client = new Redis({ port: REDIS_PORT });

  const limiter = rateLimit({
    store: new RedisRateLimitStore({
      client: redis_client,
      prefix: "rateLimit:",
    }),
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  // Merge all graphql schema files
  const typesArray = loadFilesSync(path.join(__dirname, "./modules"), {
    extensions: ["graphql"],
  });
  const typeDefs: DocumentNode = mergeTypeDefs(typesArray);

  // Find and get all resolvers
  const resolversArray = loadFilesSync(
    path.join(__dirname, "./modules/**/*.resolvers.ts")
  );

  const resolvers: any = await mergeResolvers(resolversArray);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  // generate apollo server
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      redis_client,
      url: req.protocol + "://" + req.get("host"),
      session: req.session,
      req: req,
    }),
  });

  const app = express();
  app.use(
    session({
      name: "sid",
      store: new RedisStore({ client: redis_client, prefix: REDIS_PREFIX }),
      secret: "SECRET", //FIX use env var
      resave: false,
      saveUninitialized: false, //Don't create cookie until we store data on the user
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60, //1000 * 60 * 60 * 24 * 7,  7 days
      },
    })
  );

  app.use(limiter);

  server.applyMiddleware({
    app,
    path: "/api",
    cors: { credentials: true, origin: FRONT_END_URL }, //FIX user env var
  });

  //connection to database
  await connection.create();

  app.get("/confirm/:id", (req, res, next) =>
    confirmEmail(req, res, next, redis_client)
  );

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at port http:localhost:${PORT}/api`)
  );
};
