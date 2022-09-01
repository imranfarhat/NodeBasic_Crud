const express = require("express");
const app = express();
const mongoose = require("mongoose")
const Database = require('./configurations/DatabaseconneCtion');
const {MongoClient} = require('mongodb');
// const EnviormentVariable = require('./configurations');
const UserRoute = require('./router/user');
const bodyparser = require('body-parser');
const PORT = process.env.PORT||7000;
app.use(bodyparser.json());


app.use('/',UserRoute);

app.listen(PORT, function(err, res){
    if (res) {
        console.log(`server is running on Port ${PORT}`)
    }if (err) {
        console.log('server is not running')
    }
})
