const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()
const cors = require('cors');


const port = process.env.PORT || 5000

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k4g9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("Travoky_Gladiators");
    const PackageCollection = database.collection("Packages");
    const hotelCollection = database.collection("hotels");
    const orderCollection = database.collection('orders');
    
    // GET API for packages
    app.get('/packages', async (req, res) => {
      const cursor = PackageCollection.find({})
      const result = await cursor.toArray(req)
      res.json(result);
    })
     

    //GET API for hotels
    app.get('/hotels', async (req, res) => {
      const cursor = hotelCollection.find({})
      const result = await cursor.toArray(req)
      res.json(result);
    })

    //GET MyOrder collection
    app.get('/myorder', async (req, res) => {
      const cursor = orderCollection.find({})
      const myOrders = await cursor.toArray(req);
      res.json(myOrders);
    })
    
    //POST API for orders
    app.post('/orders', async (req, res) => {
      const singleOrder = req.body;
      console.log(singleOrder);
      const result = await orderCollection.insertOne(singleOrder);
      res.json(result);
    })


    // POST API for packages
    app.post('/packages', async (req, res) => {
      const added = req.body;
      const result = await PackageCollection.insertOne(added);
      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!Its my node server')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})