const express = require('express');
const RegistrationController = require('../controllers/auth_controller');
const { AuthMiddleware } = require('../middlewares/auth_middelware');


const router=express.Router();

router.post("/otp",RegistrationController.sendOTP);
router.post("/image",AuthMiddleware.imageMiddleware,RegistrationController.sendImage);
router.post("/video",AuthMiddleware.videoMiddleware,RegistrationController.sendVideo);
router.post("/send_otp",AuthMiddleware.validateUserForSendOtp,RegistrationController.sendNumberOtp);
router.post("/verify_otp",RegistrationController.verifyOTP);
router.post("/signUp",AuthMiddleware.imageMiddleware,AuthMiddleware.signUpMiddleware,RegistrationController.signUp);
router.post("/login",AuthMiddleware.loginMiddleware,RegistrationController.login);



module.exports=router;