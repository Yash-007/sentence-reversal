const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

// verify connection 

connection.on('connected', ()=>{
    console.log("Mongo DB Connection Successfull");
})

connection.on("error", (err)=>{
    console.log('Mongo DB connection Error', err);
})