const express = require("express");
const app = express();
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const carRoutes = require("./routes/car_data_routes");
const brandRoutes = require("./routes/brand_routes");
const errorHandler = require("./error_handler/error_handler");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const port = process.env.PORT || 3000;

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
app.use(cookieParser());
app.use(session({
  secret:"secret",
  resave:false,
  saveUninitialized:false,
}),),
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/car", carRoutes);
app.use("/brand", brandRoutes);
app.use("/user", express.static("./public/images/profiles"));
app.use("/car", express.static("./public/images/car_images/thumbnails"));
app.use("/car", express.static("./public/images/car_images/feature_images"));
app.use("/brand", express.static("./public/images/brand_logos"));


app.get("/",(req,res)=>{
  console.log(req.session);
  const token =req.session.token;
  const header=req.headers.authorization.split("Bearer ")[1];
  if(token==header){
    res.json("Valid token");
  }
  else{
    res.json("Invalid");
  }
});
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
