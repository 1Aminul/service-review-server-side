const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
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

//jwt token create
app.post('/jwt', (req, res)=>{
    const user = req.body
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT, {expiresIn: '1d'})
    res.send({token})
})

function verifyJWT(req, res, next){
    const authheader = req.headers.authorization;
   
    if(!authheader){
       return  res.status(401).send({message: 'unauthorized access'})
    }
    const token = authheader.split(' ')[1]
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, function(err, decoded){
        if(err){
           return res.send(401).send({message: 'unathorized access'})
        }
        req.decoded = decoded;
        next()
    })
}


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

        app.post('/services', async(req, res)=>{
            const service = req.body
            const result = await dentistCollection.insertOne(service)
            res.send(result)
        })

        //limit data loaded
        app.get('/limited', async(req, res)=>{
            const query = {}
            const cursor = dentistCollection.find(query).limit(3)
            const service = await cursor.toArray()
            res.send(service)
        })

        //post data
        app.post('/reviews', async(req, res)=>{
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result) 
        })

        app.get('/reviews', verifyJWT,async(req, res)=>{
            let query = {}
            if(req.query.email){
               query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        //get data by query
        app.get('/reviews', async(req, res)=>{
           
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews) 
            
        })
        //update date pertiary
        app.put('/reviews/:id', async (req, res)=>{
            const id = req.params.id
            const user = req.body
            const query = { _id: ObjectId (id) }
            const updatedoc = {
                $set: {
                    review: user.review
                }
            }
            const result = await reviewCollection.updateOne(query, updatedoc)
            res.send(result)
        })

        //delete data
        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)

        })

        app.get('/reviews/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.findOne(query)
            res.send(result) 
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