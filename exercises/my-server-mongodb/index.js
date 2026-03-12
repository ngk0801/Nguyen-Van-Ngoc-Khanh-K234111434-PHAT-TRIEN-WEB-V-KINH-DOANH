const express = require('express');
const app = express();
const port = 3002;
const morgan = require("morgan");
app.use(morgan("combined"));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log(`My Server listening on port ${port}`);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("This Web server is processed for MongoDB");
});

// MongoDB Connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");

// Exercise 53: GET all fashions
app.get("/fashions", cors(), async (req, res) => {
  try {
    const result = await fashionCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Exercise 54: GET a single fashion by ID
app.get("/fashions/:id", cors(), async (req, res) => {
  try {
    const o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send({ error: "Fashion not found" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Exercise 55: POST - Create a new fashion
app.post("/fashions", cors(), async (req, res) => {
  try {
    const insertResult = await fashionCollection.insertOne(req.body);
    const newFashion = { ...req.body, _id: insertResult.insertedId };
    res.send(newFashion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Exercise 56: PUT - Update a fashion
app.put("/fashions", cors(), async (req, res) => {
  try {
    await fashionCollection.updateOne(
      { _id: new ObjectId(req.body._id) }, // condition for update
      {
        $set: {
          // Fields for updating
          style: req.body.style,
          fashion_subject: req.body.fashion_subject,
          fashion_detail: req.body.fashion_detail,
          fashion_image: req.body.fashion_image
        }
      }
    );
    // Send Fashion after updating
    const o_id = new ObjectId(req.body._id);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    res.send(result[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Exercise 57: DELETE - Remove a fashion
app.delete("/fashions/:id", cors(), async (req, res) => {
  try {
    // Find detail Fashion with id
    const o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();

    // Delete the fashion
    await fashionCollection.deleteOne({ _id: o_id });

    // Send Fashion after removal
    res.send(result.length > 0 ? result[0] : { message: "Fashion deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

console.log("All Fashion APIs configured!");
