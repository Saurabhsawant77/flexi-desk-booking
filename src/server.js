const express = require('express');

const app = express();


app.get('/',(req,res)=>{
    console.log("Hello World");
    res.send("Testing route.")
})


app.listen(3000, ()=>{
    console.log('http://localhost:3000');
})