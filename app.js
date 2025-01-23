require('dotenv').config();
const express=require('express')
const app=express()
const connectDB = require('./db/connect');
app.use(express.json());

const donation=require('./routes/donation')
const essential=require('./routes/essentials')

app.use('/api/orphan/', donation);
app.use('/api/orphan/',essential)
app.use(express.static('./public'))
const port = process.env.PORT || 5000;

const start = async() =>{
    try {
        await connectDB(process.env.mongo_uri)
        app.listen(port,()=>console.log(`server lisenting on ${port}`))
    } catch (error) {
        console.log(error)        
    }
  };
  
start()