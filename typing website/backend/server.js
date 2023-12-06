const express = require("express");
const app = express();
require('dotenv').config();
require('./config/config');
app.use(express.json());

const userRoute= require("./route/userRoute");
const dataRoute = require("./route/dataRoute");

app.use("/api/users", userRoute);
app.use("/api/data",dataRoute);


app.listen("5000", ()=>{
    console.log("server is running on port 5000");
})