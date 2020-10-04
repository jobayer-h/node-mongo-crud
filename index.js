const express = require('express');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nodeDbUser:eJ1P1pYWtqbcjBur@cluster0.n4z9q.mongodb.net/organicDb?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// db user = nodeDbUser
// password = eJ1P1pYWtqbcjBur
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html')
})



const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const productCollection = client.db("organicDb").collection("products");

    app.post('/addProduct' , (req,res)=>{
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added success');
                res.sendFile(__dirname + '/index.html')
            })
    });

    app.get('/products', (req,res)=>{
        productCollection.find({})
        .toArray( (err, docs) =>{
            res.send(docs)
        })
    })
  
});



app.listen(3000)