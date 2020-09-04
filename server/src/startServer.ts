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
import {
  REDIS_PREFIX,
  RESOLVER_FILE_TYPE,
  ENVIRONMENT,
  CORS_OPTIONS,
} from "./util/constants";
import * as rateLimit from "express-rate-limit";
import * as RedisRateLimitStore from "rate-limit-redis";
var cfenv = require("cfenv");
import * as cors from "cors";

const PORT = process.env.PORT || 4000;
const REDIS_PORT = 6379;

let appEnv: any;
let sessionSecret = "SecretKey";
if (ENVIRONMENT === "production") {
  appEnv = cfenv.getAppEnv();
  sessionSecret =
    appEnv.services["user-provided"][0].credentials.SESSION_SECRET;
}

const { url } =
  ENVIRONMENT === "production" && appEnv.services["redis"][0].credentials; //redis connection url

const RedisStore = connect_redis(session);

export const startServer = async () => {
  const redis_client =
    ENVIRONMENT === "production"
      ? new Redis(url)
      : new Redis({ port: REDIS_PORT });

  // const limiter = rateLimit({
  //   store: new RedisRateLimitStore({
  //     client: redis_client,
  //     prefix: "rateLimit:",
  //   }),
  //   windowMs: 5 * 60 * 1000, // 5 minutes
  //   max: 200, // limit each IP to 200 requests per windowMs
  // });

  // Merge all graphql schema files
  const typesArray = loadFilesSync(path.join(__dirname, "./modules"), {
    extensions: ["graphql"],
  });

  const typeDefs: DocumentNode = mergeTypeDefs(typesArray);

  // Find and get all resolvers
  const resolversArray = loadFilesSync(
    path.join(__dirname, `./modules/**/*.resolvers.${RESOLVER_FILE_TYPE}`)
  );

  const resolvers: any = await mergeResolvers(resolversArray);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  // generate apollo server
  const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
    context: ({ req, res }) => ({
      redis_client,
      url: req.protocol + "://" + req.get("host"),
      session: req.session,
      req: req,
      res,
    }),
  });

  const app = express();
  app.set("trust proxy", 1);

  app.use(
    session({
      name: "sid",
      store: new RedisStore({ client: redis_client, prefix: REDIS_PREFIX }),
      secret: sessionSecret, //FIX use env var
      resave: false,
      saveUninitialized: false, //Don't create cookie until we store data on the user
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, //1000 * 60 * 60 * 24 * 7,  7 days
      },
    })
  );

  // app.use(limiter);

  server.applyMiddleware({
    app,
    cors: { origin: CORS_OPTIONS, credentials: true },
  });

  await connection.create();

  app.get("/api/confirm/:id", (req, res, next) =>
    confirmEmail(req, res, next, redis_client)
  );

  app.get("/api/blabla", (req, res, next) => {
    res.send("hello");
  });

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at port http:localhost:${PORT}/api`)
  );
};
