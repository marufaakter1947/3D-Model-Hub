const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://model-db:4XyNe1PFL3jQaEG7@firstcluster.6t8rb7j.mongodb.net/?appName=firstCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("model-db");
    const modelCollection = db.collection("models");

    // get method
    // find
    // findOne
    app.get("/models", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    // details
    app.get("/models/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);

      const result = await modelCollection.findOne({ _id: new ObjectId(id) });

      res.send({
        success: true,
        result,
      });
    });

    // post method
    // insertMany
    // insertOne
    app.post("/models", async (req, res) => {
      const data = req.body;
      // console.log(data);
      const result = await modelCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    // Update method:PUT
    // updateOne
    // updateMany

    app.put("/models/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      // console.log(id)
      // console.log(data);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await modelCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    // Delete
    // deleteOne
    // deleteMany
    app.delete("/models/:id", async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });

      res.send({
        success:true,
        result,
      })
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running Fine!");
});

app.get("/hello", (req, res) => {
  res.send("Hello,How are You?");
});

app.listen(port, () => {
  console.log(`Server is  listening on port ${port}`);
});
