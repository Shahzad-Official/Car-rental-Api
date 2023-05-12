const User = require("../models/user_model");
const jwt=require("jsonwebtoken");

class UserMiddlewares{
    static validateUser=(req,res,next)=>{
        const token=req.headers.authorization.split(" ")[1];
       const result= jwt.decode(token);
       const {email}=result;
        User.findOne({email:email}).then((doc)=>{
            if(!doc){
                res.status(404).json({message:"This email does not exist!"});
            }else{
                next();
            }
        }).catch((err)=>{
            res.status(500).json({error:"Error fetching data!"});
        });
    };
}
module.exports=UserMiddlewares;