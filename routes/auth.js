const express = require('express');
const RegistrationController = require('../controllers/auth');
const AuthMiddlewares=require("../middlewares/auth");

const router=express.Router();
router.post("/otp",RegistrationController.sendOTP);
router.post("/file",AuthMiddlewares.singleImageMiddleware,RegistrationController.sendFile);
router.post("/send_otp",RegistrationController.sendNumberOtp);
router.post("/verify_otp",RegistrationController.verifyOTP);

module.exports=router;