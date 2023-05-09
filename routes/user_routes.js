const express=require("express");
const UserController = require("../controllers/user_controller");
const AuthMiddleware = require("../middlewares/auth_middelware");
const RegistrationController = require("../controllers/auth_controller");
 const router=express.Router();


 router.get("/allUsers",AuthMiddleware.tokenAuthentication,UserController.getAllUsers);
 

 module.exports=router;