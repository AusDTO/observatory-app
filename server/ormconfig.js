require("dotenv").config();
const fs = require("fs");
var cfenv = require("cfenv");

var appEnv;
var productionDatabase;
if (process.env.NODE_ENV === "production") {
  appEnv = cfenv.getAppEnv();
  productionDatabase = {
    name: "production",
    type: "postgres",
    host: appEnv.services["user-provided"][0].DB_HOST,
    port: 5432,
    username: appEnv.services["user-provided"][0].credentials.DB_USER,
    password: appEnv.services["user-provided"][0].credentials.DB_PASSWORD,
    database: appEnv.services["user-provided"][0].credentials.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["dist/entity/**/*"],
    migrations: ["dist/migration/**/*"],
    subscribers: ["dist/subscriber/**/*"],
    cli: {
      entitiesDir: "dist/entity",
      migrationsDir: "dist/migration",
      subscribersDir: "dist/subscriber",
    },
    extra: {
      ssl: true,
    },
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync("./server-ca.pem", "utf-8"),
      cert: fs.readFileSync("./client-cert.pem", "utf-8"),
      key: fs.readFileSync("./client-key.pem", "utf-8"),
    },
  };
}

const developmentDatabase = {
  name: "development",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "observatory",
  synchronize: true,
  logging: true,
  entities: ["src/entity/**/*"],
  migrations: ["src/migration/**/*"],
  subscribers: ["src/subscriber/**/*"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

const testDatabase = {
  name: "test",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "observatory-test",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: ["src/entity/**/*"],
  migrations: ["src/migration/**/*"],
  subscribers: ["src/subscriber/**/*"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

function getDatabase() {
  if (process.env.NODE_ENV === "development") return developmentDatabase;
  if (process.env.NODE_ENV === "test") return testDatabase;
  if (process.env.NODE_ENV === "production") return productionDatabase;
  return developmentDatabase;
}

module.exports = [getDatabase()];
