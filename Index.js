const express = require('express');
var fs = require('fs');

// navigator

const { Navigator } = require('node-navigator')
const navigator = new Navigator();


// navigator.geolocation.getCurrentPosition((e) => {
//     console.log(e.coords.latitude)
// })








var util = require('util');
var logFile = fs.createWriteStream('log.log', { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;


const app = express()
const mongoose = require('mongoose');
const router = require('./router/router');
const cors = require('cors');
require("dotenv").config()
const KEY = process.env.SECKRET_KEY

app.set("view engine", "ejs")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
app.use(cookieParser())

console.log("path", __dirname);
// app.use(express.static("upload"))
app.use(express.static(__dirname + "/photos"))

app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())




const port = process.env.PORT || 60000
const url = process.env.URL

mongoose.connect(url, (err, result) => {
    if (err) {
        console.log("not connected..")
    }
    else {
        console.log("successfull connected")
    }
})

app.use(router)








app.listen(port, (err) => {
    if (err) {
        console.log("give error", err.name)
    }
    else {
        console.log(`port is strating at ${port}`)
    }
})