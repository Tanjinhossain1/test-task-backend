const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config(); 
const port = process.env.PORT || 5000 



app.use(cors())
app.use(express.json())
  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrrtzzi.mongodb.net/?retryWrites=true&w=majority`; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const selectorData = client.db("userData").collection("data");
        const userDataCollection = client.db("collectionData").collection("data");
         
        //   get all selectors   //
        app.get('/selectors', async (req, res) => {
            const selectors = await selectorData.find().toArray();
            res.send(selectors)
        })

        // get the all user data 
        app.get('/getUserData', async (req, res) => {
            const userData = await userDataCollection.find().toArray();
            res.send(userData)
        }) 

        // all Post method //  
        app.post('/createUserData', async (req, res) => {
            const productDetail = req.body;
            const addProduct = await userDataCollection.insertOne(productDetail);
            res.send(addProduct)
        }) 

        // put method 

        app.put('/updateUserData/:id', async (req, res) => {
            const id = req.params.id; 

            const profile = req.body;
            console.log(id,profile)
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: profile.name,
                    selectors: profile.selectors, 
                },
            };
            const result = await userDataCollection.updateOne(filter, updateDoc);
            res.send(result)
        })
  
        // delete user Data
        app.delete('/deleteUserData/:id', async (req, res) => {
            const id = req.params.id;  
            const query = { _id: ObjectId(id) };
            const deleteUserData = await userDataCollection.deleteOne(query);
            res.send(deleteUserData)
        })  

    }
    finally {
        // client.close();
    }

}
run().catch(console.dir())
 
app.get('/', (req, res) => {
    res.send('Hello World! from tools')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})