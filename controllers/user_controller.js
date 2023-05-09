const User = require("../models/user_model");

class UserController {
  static getAllUsers = async (req, res) => {
    await User.find()
      .then((data) => {
        var list=[];
        data.forEach(element => {
            list.push(element);
        });
        if(list.length==0){
            res.json({message:"No user registered yet!"});
        }else{
            res.json({message:"Users found successfully!",data:data});
        }
      })
      .catch((err) => {
        res.json(err);
      });
  };
}
module.exports = UserController;
