require("dotenv").config();
const fs = require("fs");
var cfenv = require("cfenv");

var appEnv;
var prodUsername = "";
var prodPassword = "";
var prodDatabaseName = "";
var prodHost = "";
var prodPort = "";

if (process.env.NODE_ENV === "production") {
  appEnv = cfenv.getAppEnv();
  var postgres = "production" && appEnv.services["postgres"][0].credentials;
  prodUsername = postgres.username;
  prodPassword = postgres.password;
  prodHost = postgres.hostname;
  prodPort = postgres.port;
  prodDatabaseName = postgres.dbname;
}

console.log("==================ENV=======");
console.log(process.env.NODE_ENV);
console.log("==================ENV=======");

console.log(prodDatabaseName);

const productionDatabase = {
  name: "production",
  type: "postgres",
  host: prodHost,
  port: prodPort,
  username: prodUsername,
  password: prodPassword,
  database: prodDatabaseName,
  synchronize: true,
  logging: false,
  entities: ["./entity/**/*"],
  migrations: ["./migration/**/*"],
  subscribers: ["./subscriber/**/*"],
  cli: {
    entitiesDir: "./entity",
    migrationsDir: "./migration",
    subscribersDir: "./subscriber",
  },
};

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
