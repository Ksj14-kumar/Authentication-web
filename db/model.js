const mongoose = require('mongoose');
require("dotenv").config()
// const Key = process.env.SECKRET_KEY


const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token: { type: String, required: true }


})

Schema.add({
    password: {
        type: String,
        required: true

    },
    cpassword: { type: String, required: true, trim: true }

})
Schema.add({
    image: {
        type: String, trim
            : true
    }
})


const model = mongoose.model("registration", Schema)

module.exports = model;



