const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  try {
    await db.collection("users").insertOne(req.body);
    res.status(201).json({
      status: 201,
      message: "Success",
    });
  } catch (e) {
    console.log(e);
  }
  client.close();
};

module.exports = { addUser };
