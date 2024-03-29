const mongoose = require("mongoose");
const { dbConnection } = require("./db_config");

const findOneModel = async (referenceValue, db_collection, getValue = null) => {
  try {
    const db = await dbConnection();
    const collection = db.collection(db_collection);

    const result = await collection.findOne(referenceValue, getValue);

    if (result !== null) {
      return result;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findAllModel = async (
  referenceValue,
  db_collection,

  projectValue = null
) => {
  try {
    const db = await dbConnection();
    const collection = db.collection(db_collection);
    const result = await collection
      .find(referenceValue, projectValue)
      .toArray();

    if (result !== null) {
      return result;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const insertOneObject = async (insetValue, dbCollection, message) => {
  try {
    const db = await dbConnection();
    const collection = db.collection(dbCollection);
    const result = await collection.insertOne(insetValue);
    if (result["acknowledged"] == true) {
      return `${message} Successfully`;
    } else return "Error while adding data";
  } catch (error) {
    console.info(error);
    return error;
  }
};

module.exports = { findOneModel, findAllModel, insertOneObject };
