import * as _ from "lodash";

export const ObjectStringToInt = (object: any, field: string) => {
  return _.map(object, (item) => {
    let newItem = _.clone(item);
    newItem[field] = parseInt(newItem[field], 10);
    return newItem;
  });
};

export const ScaleSecondsToMins = (object: any, field: string) => {
  return _.map(object, (item) => {
    let newItem = _.clone(item);
    newItem[field] = parseFloat((parseInt(newItem[field], 10) / 60).toFixed(2));

    return newItem;
  });
};
