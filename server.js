const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const database=require('./app/dbconfig/db');
const app=express();

// const port='80';
const port = process.env.PORT || 90;
const json_body_parser = bodyParser.json();
const urlencoded_body_parser = bodyParser.urlencoded({ extended: true });
app.use(json_body_parser);
app.use(urlencoded_body_parser);
app.set('view engine', 'ejs');



MongoClient.connect(database.url,(err,database)=>{
    if(err) return console.log(err);
    require('./app/routes')(app,database);
    // const myAwesomeDB = database.db
    app.listen(port,'172.16.36.102',()=>{
        console.log("We are Live on "+port);
    })
})