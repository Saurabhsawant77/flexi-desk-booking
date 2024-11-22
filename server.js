require('dotenv').config();
const express = require('express');
const connectMongoDB = require('./src/config/db');
const mainRouter = require('./src/routes');



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectMongoDB(process.env.MONGODB_URL);
app.use('/api',mainRouter);




app.get('/',(req,res)=>{
    console.log("Hello World");
    res.send("Testing route.")
})


app.listen(3000, ()=>{
    console.log('http://localhost:3000');
})

