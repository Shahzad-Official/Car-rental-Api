const express = require('express');
const RegistrationController = require('../controllers/auth_controller');
const AuthMiddlewares=require("../middlewares/auth_middelware");

const router=express.Router();
router.post("/otp",RegistrationController.sendOTP);
router.post("/image",AuthMiddlewares.imageMiddleware,RegistrationController.sendImage);
router.post("/video",AuthMiddlewares.videoMiddleware,RegistrationController.sendVideo);
router.post("/send_otp",RegistrationController.sendNumberOtp);
router.post("/verify_otp",RegistrationController.verifyOTP);
router.post("/signUp",AuthMiddlewares.signUpMiddleware,RegistrationController.signUp);
router.post("/login",AuthMiddlewares.loginMiddleware,RegistrationController.login);



module.exports=router;