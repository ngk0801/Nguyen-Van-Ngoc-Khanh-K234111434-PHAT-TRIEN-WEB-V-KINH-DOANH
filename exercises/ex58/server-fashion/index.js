const express = require('express');
const app = express();
const port = 4000;
const morgan = require("morgan");
app.use(morgan("combined"));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log(`Fashion Server listening on port ${port}`);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Fashion Server API - Port 4000");
});

// MongoDB Connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");

// API 1: Get all fashions sorted by creation date (descending)
app.get("/api/fashions", cors(), async (req, res) => {
  try {
    const result = await fashionCollection
      .find({})
      .sort({ createdDate: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// API 2: Filter fashions by style
app.get("/api/fashions/filter/:style", cors(), async (req, res) => {
  try {
    const style = req.params["style"];
    const result = await fashionCollection
      .find({ style: { $regex: style, $options: 'i' } })
      .sort({ createdDate: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// API 3: Get a single fashion by ID
app.get("/api/fashions/:id", cors(), async (req, res) => {
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

// API 4: Create a new fashion
app.post("/api/fashions", cors(), async (req, res) => {
  try {
    const fashionData = {
      ...req.body,
      createdDate: new Date()
    };
    const insertResult = await fashionCollection.insertOne(fashionData);
    const newFashion = { ...fashionData, _id: insertResult.insertedId };
    res.send(newFashion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// API 5: Update a fashion
app.put("/api/fashions", cors(), async (req, res) => {
  try {
    await fashionCollection.updateOne(
      { _id: new ObjectId(req.body._id) },
      {
        $set: {
          title: req.body.title,
          detail: req.body.detail,
          thumbnail: req.body.thumbnail,
          style: req.body.style,
          updatedDate: new Date()
        }
      }
    );
    const o_id = new ObjectId(req.body._id);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    res.send(result[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// API 6: Delete a fashion
app.delete("/api/fashions/:id", cors(), async (req, res) => {
  try {
    const o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    await fashionCollection.deleteOne({ _id: o_id });
    res.send(result.length > 0 ? result[0] : { message: "Fashion deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// API 7: Get all available styles
app.get("/api/styles", cors(), async (req, res) => {
  try {
    const styles = await fashionCollection.distinct("style");
    res.send(styles);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

console.log("Fashion Server APIs configured!");
