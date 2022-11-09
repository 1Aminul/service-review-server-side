const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.flkzc5o.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dentistCollection =  client.db('dentist').collection('service');
const reviewCollection = client.db('dentist').collection('reviews')

async function run(){
    try{
        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor =  dentistCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)

        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await dentistCollection.findOne(query)
            res.send(result)
        })

        //limit data loaded
        app.get('/limited', async(req, res)=>{
            const query = {}
            const cursor = dentistCollection.find(query).limit(3)
            const service = await cursor.toArray()
            res.send(serviceexjs)
        })

        //post data
        app.post('/reviews', async(req, res)=>{
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result) 
        })

        app.get('/reviews', async(req, res)=>{
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })


    }
    finally{

    }
}
run().catch(err => console.log(err))



app.get('/', (req, res)=>{
    res.send('review server side is running')
})
app.listen(port, ()=>{
    console.log('review server', port);
})