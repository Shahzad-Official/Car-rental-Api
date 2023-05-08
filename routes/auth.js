const express = require('express');
const RegistrationController = require('../controllers/auth');
const multer = require('multer');

const path=require("path");



var storageHandler = multer.diskStorage({
    destination: "./public/upload",
    filename: (req, file, cb) => {
     
     const filename=file.fieldname+"_"+Date.now()+ path.extname(file.originalname);
     console.log(filename);
      cb(null,filename);
    },
  });
const multerStorage=multer({storage:storageHandler});
const router=express.Router();
router.post("/otp",RegistrationController.sendOTP);
router.post("/file",multerStorage.array("file"),RegistrationController.sendFile);
router.post("/send_otp",RegistrationController.sendNumberOtp);
router.post("/verify_otp",RegistrationController.verifyOTP);

module.exports=router;