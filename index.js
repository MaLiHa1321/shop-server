const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntnzcww.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

      // Connect to the "insertDB" database and access its "haiku" collection
      const database = client.db("shopDB");
      const shopCollection = database.collection("shop");
      const userCollection = database.collection('users')

// create product

    app.post('/shop', async(req,res) =>{
        const product = req.body;
        console.log(product)
        const result = await shopCollection.insertOne(product)
        res.send(result)
    })

    // create user
    app.post('/users', async(req,res)=>{
        const newUser = req.body;
        console.log(newUser)
        const result = await userCollection.insertOne(newUser)
        res.send(result)
    })

// get product
app.get('/shop', async(req,res) =>{
    const cursor = shopCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})

// delete product
app.delete('/shop/:id', async(req,res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await shopCollection.deleteOne(query)
    res.send(result)
})

// update product
app.get('/shop/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await shopCollection.findOne(query);
    res.send(result)
})

app.put('/shop/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const options = { upsert: true };
    const updateProduct = req.body;
    const product ={
        $set : {
            name: updateProduct.name,
            quantity: updateProduct.quantity,
            photo: updateProduct.photo
        }
    }
    const result = await shopCollection.updateOne(filter,product,options)
    res.send(result)

})







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})