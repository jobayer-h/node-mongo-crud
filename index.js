const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nodeDbUser:eJ1P1pYWtqbcjBur@cluster0.n4z9q.mongodb.net/organicDb?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3000;

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
                // res.sendFile(__dirname + '/index.html');
                res.redirect('/')
            })
    });

    app.get('/products', (req,res)=>{
        productCollection.find({})
        .toArray( (err, docs) =>{
            res.send(docs)
        })
    });
    //update item 
    app.get('/product/:id', (req,res)=>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray( (err, docs) =>{
            res.send(docs[0]);
        })
    });


    app.patch('/update/:id', (req,res) => {
        productCollection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity, name:req.body.name}
        })
    })

    app.delete('/delete/:id', (req,res) => {
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        
    })   
});



app.listen(process.env.PORT || port)