const express = require('express');
const app = express()
const router = express.Router()
// const multer = require('multer');
const authentication = require('../middleware/auth');
const header = require('../Controller/AllController');
const multer = require('../multerCode/multer');




//routing start





router.get("/allprofiles", header.view)
router.get("/", header.home)

router.post("/register", header.register)
router.post("/login", header.login)
router.delete("/:id", header.deleteById)
router.get("/get/:id", header.getById)


console.log("authentication", authentication)




//authentication router
router.get("/welcome", authentication, header.welcome)
router.get("/service", authentication, header.service)
router.get("/contact", authentication, header.contact)
router.get("/about", authentication, header.about)
router.get("/profile", authentication, header.profile)
router.get("/view_profile", authentication, header.view_profile)
router.post("/update", authentication, header.update)
router.post("/uploaddata", authentication, multer.single("file"), header.uploaddata)


//singup and singin  router
router.get("/singup", header.singup)
router.get("/lost", header.lost)
router.get("/singin", header.singin)
router.get("/unautherized", header.unautherized)
router.get("/logout", header.logout)



//inavlid router

router.get("/*", header.FirstPage)
router.get("/*/*", header.SecondPage)







module.exports = router;