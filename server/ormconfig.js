const productionDatabase = {
  name: "production",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "raj",
  password: "",
  database: "observatory",
  synchronize: true,
  logging: true,
  entities: ["dist/entity/**/*"],
  migrations: ["dist/migration/**/*"],
  subscribers: ["dist/subscriber/**/*"],
  cli: {
    entitiesDir: "dist/entity",
    migrationsDir: "dist/migration",
    subscribersDir: "dist/subscriber",
  },
};

const developmentDatabase = {
  name: "development",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "raj",
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
  username: "raj",
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
console.log("src/entity/**/*");

function getDatabase() {
  if (process.env.NODE_ENV === "development") return developmentDatabase;
  if (process.env.NODE_ENV === "test") return testDatabase;
  if (process.env.NODE_ENV === "production") return productionDatabase;
  return developmentDatabase;
}

module.exports = [getDatabase()];
