const express=require("express");
const UserController = require("../controllers/user_controller");
 const router=express.Router();


 router.get("/allUsers",UserController.getAllUsers);

 module.exports=router;