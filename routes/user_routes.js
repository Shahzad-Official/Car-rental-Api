const express=require("express");
const UserController = require("../controllers/user_controller");

const UserMiddlewares = require("../middlewares/user_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");
 const router=express.Router();


 router.get("/allUsers",UserMiddlewares.validateUser,AuthMiddleware.tokenAuthentication,UserController.getAllUsers);
 router.put("/updateProfile",AuthMiddleware.imageMiddleware,UserMiddlewares.updateMiddleware,AuthMiddleware.tokenAuthentication,UserController.updateUser);
 router.put("/resetPassword",UserMiddlewares.updatePasswordMiddleware,UserController.updatePassword);
 router.put("/updateStatus",UserMiddlewares.updateStatusMiddleware,UserController.updateUserStatus);
 

 module.exports=router;