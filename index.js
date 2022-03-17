const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.iuevi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("database connected");
    const database = client.db("fakeDB");
    const userCollection = database.collection("users");
    const productCollection = database.collection("products");

    // insert a single user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // get all user
    app.get("/users", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.json(result);
    });
    // get a single user by id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: ObjectId(id) });
      res.json(result);
    });
    // delete a single user

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });
  } finally {
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  const resData = {
    get_all_user: "",
    get_single_user: "",
    insert_single_user: "",
    delete_single_user: "",
  };
  res.json(resData);
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
