import { startServer } from "../startServer";
import { testAgency, testProperies } from "./testData";
import { Agency } from "../entity/Agency";
import { Property } from "../entity/Property";

export const setup = async () => {
  await startServer();

  // const properties = testProperies;

  // properties.forEach(async (property) => {
  //   const propertyToInsert = Property.create({ ...property });
  //   await Property.save(propertyToInsert);
  // });

  process.env.TEST_HOST = `http://localhost:4000/api`;
  process.env.TEST_HOST_2 = `http://localhost:4000`;
};
