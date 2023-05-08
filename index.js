const express = require("express");
const app = express();
const router = require("./routes/auth");
const errorHandler = require("./error_handler/error_handler");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const Test = require("./models/user");
const port=process.env.PORT||3000;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    throw Error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use("/uploads", express.static("./public/upload"));
app.use("/",(req,res)=>{
  res.json({message:"Api is working fine"});
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port "+port);
});
