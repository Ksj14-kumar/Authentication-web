const jwt = require('jsonwebtoken');
const Post = require('../db/model');
const bcrypt = require('bcrypt');
const express = require('express');
const Dpost = require('../db/data');
const fs = require("fs")

const app = express()
const authentication = require('../middleware/auth');
const navigator = require('../Navigator/navigator');
require("dotenv").config()



const KEY = process.env.SECKRET_KEY



function isEmailValid(email) {
    var pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return pattern.test(email)
}



exports.view = async (req, res, next) => {
    try {
        const data = await Post.find()
        // res.render("home")
        // res.end()
        res.json(data)
    }
    catch (err) {
        res.send({ message: "Give something error" + err.name })
    }
}
exports.welcome = async (req, res) => {
    res.render("welcome")
}







exports.register = async (req, res) => {


    try {
        console.log(req.body);
        // console.log("backend data", req.body)
        const { name, email, password, cpassword } = req.body;
        // const image = req.file.originalname

        var emailVerify = await Post.find({
            'email': email
        })




        //check some field is empty or not
        // if (!name || !email || !password || !cpassword) {
        //     res.status(404).json({ message: "Something is Not Filled" })
        // }
        if (emailVerify.length != 0) {
            return res.status(301).json({ message: "email" })


        }

        //check the user details is valid or not and password match or not
        if (password === cpassword) {
            const vname = await name.length < 3 ? false : true
            const vEmail = await isEmailValid(email)
            const vPassword = await password.length < 5 ? false : true
            const vCpassword = await cpassword.length < 5 ? false : true
            // const vImage = await image.length == null ? false : true


            if (!vname) {
                res.json({ message: "name is smaller" })
            }
            else {
                var Verifyname = name

            }
            if (!vEmail) {

                res.json({ message: "Email is not Valid" })
            }
            else {
                var VerifyEmail = email

            }
            if (!vPassword) {
                res.json({ message: "password is short" })
            }
            else {
                var VerifyPassword = password
            }
            if (!vCpassword) {
                res.json({ message: "confim password is short" })
            }
            else {
                var VerifyCpassword = cpassword


            }
            // if (!vImage) {
            //     res.json({ message: "Iamge field is not empty" })
            // }
            // else {
            //     var VerifyImage = image
            // }
            // console.log("images data", VerifyCpassword, VerifyEmail, VerifyImage)

            //Store the user Data into the DataBases
            var UserData = new Post({
                name: Verifyname, email: VerifyEmail,
                password: await bcrypt.hash(VerifyPassword, 10),
                cpassword: await bcrypt.hash(VerifyCpassword, 10),
                // image: VerifyImage

            })
            console.log("userinfo", UserData)



            var jwttoken = jwt.sign({ email: UserData.email }, KEY)
            UserData.token = jwttoken
            // console.log(UserData.token)



            UserData.save((err) => {
                if (err) {
                    res.status(301).redirect("/lost")

                }
                else {
                    console.log("successfull save")
                    // window.alert("success full send")
                    // res.status(200).cookie("jwttoken", jwttoken).json({ message: "successfull saved" })

                    res.status(201).cookie("jwttoken", jwttoken, { maxAge: 300000 }).redirect("/singin")
                    // json({ message: "save" })
                    // .redirect("/singin")
                    // redirect("/login")
                    // render("login")
                }
            })

        }
        else {
            res.status(422).json({ message: "password not match" })
        }


    }
    catch (err) {
        res.status(422).json({ message: "notsave" })
    }

}



exports.login = async (req, res) => {

    console.log(req.body)
    // console.log("cooki",req.cookies.jwttoken)
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.json({ message: "Please Fill Data correct" })
        }
        if (email == "" || password == "") {
            res.json({ message: "please Fill the blanks" })
        }
        const loginDetails = await Post.find({ email: email })
        if (loginDetails.length < 1) {
            res.status(404).render("invalidCredential") //set template
        }
        else {

            bcrypt.compare(password, loginDetails[0].password, async (err, result) => {
                if (err) {
                    res.status(401).render("oopsError.ejs") //set HTML TEmplate
                }


                if (result) {

                    var jwttoken = jwt.sign({ email: loginDetails[0].email }, KEY)
                    loginDetails[0].token = jwttoken
                    res.cookie("jwttoken", jwttoken, { maxAge: 300000 }).render("home", { logoutLogin: true })
                    // res.cookie("jwttoken", jwttoken).redirect("/home")

                }
                else {
                    res.status(401).render("invalidCredential") //send HTML template
                }
            })

        }
    }
    catch (err) {
        res.render("oopsError.ejs")
    }


}


exports.getById = async (req, res) => {
    try {

        const data = await Post.findById({ _id: req.params.id })
        if (!data) {
            res.json({ message: "id not exit" })
        }
        else {
            res.json(data)
        }

    }
    catch (err) {
        res.json({ message: "something cast error occur error " + err.name })

    }
}


exports.deleteById = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            res.json({ message: "please fill Id" })
        }


        await Post.findByIdAndRemove({ _id: id })
        res.json({ message: "successfull delete" })
    }
    catch (err) {
        res.json({ message: "can't not delete" })
    }
}


exports.contact = async (req, res) => {
    const { name1, email } = req.userData
    try {
        console.log(email);
        console.log(Dpost.findOne({ email: email }));






        const { name, address, mobile, website } = await Dpost.findOne({ email: email })
        res.render("contact", { name: name.toUpperCase(), email: email, address: address, mobile: mobile, website: "www.Profiler.Com" })

    } catch (error) {
        res.status(403).json({ message: "Data Not Found, Create profile" })

    }

}
exports.service = async (req, res) => {
    res.render("service")
}

exports.about = async (req, res) => {
    try {
        console.log("user info", req.userData)
        console.log("tokenabout", req.token)
        const { name, email, ...otherData } = req.userData
        const aboutData = await Dpost.findOne({ email: email })
        console.log(aboutData.about);

        res.render("about", { about: aboutData.about })


    } catch (err) {
        res.status(403).render("emptyAbout")
        // json({ message: "Sorry Data Not Exit, 1st create Profile" })

    }


}

exports.home = async (req, res) => {
    res.status(200).render("home", { logoutLogin: false })
}

exports.singup = async (req, res) => {
    res.status(200).render("registerdata")
}


exports.lost = async (req, res) => {
    res.status(200).render("lost")
}

exports.unautherized = async (req, res) => {
    res.status(200).render("unautherized")
}
exports.singin = async (req, res) => {
    // console.log("successfull login");
    res.status(200).render("login")

}

exports.logout = async (req, res) => {
    res.clearCookie("jwttoken").render("home", { logoutLogin: false })
}

exports.FirstPage = async (req, res) => {
    res.render("PageOut")

}

exports.SecondPage = async (req, res) => {
    res.render("PageOut")

}
exports.profile = async (req, res) => {
    res.render("profile")

}

exports.uploaddata = async (req, res) => {


    try {
        console.log("update data", req.body);
        const { name, gender, birth, address, state, city, pincode, phone, mobile, about, file } = req.body

        console.log("updated data", req.body);
        const image = req.file.filename
        // console.log("file data", req.file)
        console.log("images", image);
        const { name1, email, ...otherData } = req.userData

        // console.log("body data", req.body)

        const info = await new Dpost({
            name: name,
            email: email,
            gender: gender,
            dob: birth,
            address: address,
            // nationality: nationality,
            state: state, city: city,
            pincode: pincode,
            phone: phone,
            mobile: mobile,
            about: about,
            image: image
        })
        console.log(req.token);
        console.log("userdata", req.userData);

        console.log("info data", info)



        info.token = req.userData.token

        // Post.find({})
        // console.log(authentication)



        info.save((err, result) => {
            console.log("error name is ", err);

            if (err) {
                res.json({ message: "information not save" + err.name })
            }
            else {
                res.json({ message: "information  saved" })
            }
        })

    }
    catch (err) {
        res.json({ message: "give Something error" + err.name })
    }




}

exports.view_profile = async (req, res) => {

    try {
        console.log("console window");
        // console.log("file data", req.file.filename)

        const { email } = req.userData
        const dataForProfile = await Dpost.findOne({ email: email })
        console.log("data", "../photos/1.jpg");

        console.log("data for", dataForProfile.name);
        console.log("data for", dataForProfile);
        console.log("data for", dataForProfile.image);

        res.render("view_profile",
            {
                image: `./${dataForProfile.image}`,
                name: dataForProfile.name.toUpperCase(),
                gender: dataForProfile.gender.toUpperCase(),
                date: dataForProfile.dob,
                address: dataForProfile.address.toUpperCase(),
                state: dataForProfile.state.toUpperCase(),
                city: dataForProfile.city.toUpperCase(),
                pincode: dataForProfile.pincode.toUpperCase(),
                phone: dataForProfile.phone.toUpperCase(),
                mobile: dataForProfile.mobile,
                about: dataForProfile.about.toUpperCase()
            }
        )

    }
    catch (err) {
        if (err) {
            res.json({ message: "something Error, either your data is deleted, any other problem" })
        }
        else {
            res.json({ message: "Successful" })

        }
    }


}


exports.update = async (req, res) => {
    try {
        const { _id } = req.userData
        console.log("upload data", req.body)
        const userDataUpdate = await Dpost.findByIdAndUpdate({ _id: _id }, { name: req.body.name, gender: req.body.gender, dob: req.body.birth, address: req.body.address, state: req.body.state, city: req.body.city, pincode: req.body.pincode, phone: req.body.phone, mobile: req.body.mobile })

        userDataUpdate.save((err) => {
            if (err) {
                res.json({ message: "Update not save" })
            }
            else {
                res.json({ message: "update successful" })
                res.redirect("/")
            }
        })


    }
    catch {
        res.json({ message: "can not update" })

    }

}