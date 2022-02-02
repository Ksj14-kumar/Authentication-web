const jwt = require("jsonwebtoken");
const Post = require("../db/model");
require('dotenv').config();
// , "token": userToken }
const KEY = process.env.SECKRET_KEY
var authentication = async (req, res, next) => {
    try {
        const userToken = req.cookies.jwttoken
        console.log("user token", userToken)
        const verifyToken = await jwt.verify(userToken, KEY)
        console.log("verifytoken", verifyToken)
        const VerifyUser = await Post.findOne({ email: verifyToken.email })
        console.log("verigy user", VerifyUser)
        console.log("verify token", verifyToken);
        if (!VerifyUser) {
            console.log("user not verify")
            res.redirect("/home")
            res.json({ message: "user not verify" })

        }
        else {
            req.token = userToken
            req.userData = VerifyUser
        }
        next()
    }
    catch (err) {
        res.status(401).redirect("/unautherized")

    }

}

module.exports = authentication


