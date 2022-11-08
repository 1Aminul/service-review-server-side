const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.flkzc5o.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dentistCollection =  client.db('dentist').collection('service');

async function run(){
    try{
        app.get('/services', async(req, res)=>{
            const query = {}

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