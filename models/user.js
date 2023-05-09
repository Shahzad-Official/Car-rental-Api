const { default: mongoose } = require("mongoose");

// User schema
mongoose
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    // Add more fields as per your requirements
  });
  
  // User model
  const User = mongoose.model('User', userSchema);
  module.exports=User;
  