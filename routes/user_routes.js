const express=require("express");
const UserController = require("../controllers/user_controller");
const AuthMiddleware = require("../middlewares/auth_middelware");
const UserMiddlewares = require("../middlewares/user_middleware");
 const router=express.Router();


 router.get("/allUsers",UserMiddlewares.validateUser,AuthMiddleware.tokenAuthentication,UserController.getAllUsers);
 

 module.exports=router;