import { startServer } from "../startServer";

export const setup = async () => {
  await startServer();

  process.env.TEST_HOST = `http://localhost:4000/api`;
  process.env.TEST_HOST_2 = `http://localhost:4000`;
};
