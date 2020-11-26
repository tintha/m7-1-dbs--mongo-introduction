const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    db.collection("greetings").findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 400, _id, data: "Not found" });
      client.close();
    });
  } catch (err) {
    console.log(err);
  }
};

const getGreetings = async (req, res) => {
  const start = req.query.start;
  const limit = req.query.limit;

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").find().toArray();

    if (result) {
      if ((!start && !limit) || (isNaN(start) && isNaN(limit))) {
        res.status(200).json({
          status: 200,
          start: 0,
          limit: 25,
          data: result.slice(0, 25),
        });
      } else if (!start || isNaN(start)) {
        const userLimit = Math.abs(Math.round(limit));
        let changedLimit;
        userLimit > result.length
          ? (changedLimit = result.length)
          : (changedLimit = userLimit);

        res.status(200).json({
          status: 200,
          start: 0,
          limit: changedLimit,
          data: result.slice(0, changedLimit),
        });
      } else if (!limit || isNaN(limit)) {
        let userStart = Math.abs(Math.round(start));
        // fallback: show last item if user's start query is > the # of elements
        userStart >= result.length
          ? (userStart = result.length - 1)
          : (userStart = userStart);
        const defaultLimit = 25;
        let setLimit;
        userStart + defaultLimit > result.length
          ? (setLimit = result.length - userStart)
          : (setLimit = defaultLimit);
        res.status(200).json({
          status: 200,
          start: userStart,
          limit: setLimit,
          data: result.slice(userStart, userStart + setLimit),
        });
      }
    } else {
      res.status(404).json({ status: 400, data: "Not found" });
    }

    client.close();
  } catch (e) {
    console.log(e);
  }
};

const deleteGreeting = async (req, res) => {};

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting };
