const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    required:true,
    unique:true,
    type:String,
  },
  age: Number
});

const Test = mongoose.model('Test', testSchema);
module.exports=Test;