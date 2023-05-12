const express=require("express");
const UserController = require("../controllers/user_controller");

const UserMiddlewares = require("../middlewares/user_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");
 const router=express.Router();


 router.get("/allUsers",UserMiddlewares.validateUser,AuthMiddleware.tokenAuthentication,UserController.getAllUsers);
 

 module.exports=router;