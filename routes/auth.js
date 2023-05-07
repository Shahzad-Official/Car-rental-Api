const express = require('express');
const { sendOTP, sendFile } = require('../controllers/auth');
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
router.post("/otp",sendOTP);
router.post("/file",multerStorage.array("file"),sendFile);

module.exports=router;