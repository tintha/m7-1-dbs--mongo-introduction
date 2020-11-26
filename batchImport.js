const { assert } = require("console");
const fs = require("fs");
const greetings = JSON.parse(fs.readFileSync("./data/greetings.json"));
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const greetingsLength = greetings.length;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").insertMany([...greetings]);
    assert.strictEqual(greetingsLength, result.insertedCount);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }
};

batchImport();
