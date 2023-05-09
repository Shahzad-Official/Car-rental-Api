const express = require("express");
const app = express();
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const errorHandler = require("./error_handler/error_handler");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const cookieParser=require("cookie-parser");

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
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("./public/upload"));


app.get("/", (req, res) => {
  res.cookie("name","value");
  res.json({ message: "Api is working" });
});

app.get("/error", (req, res) => {
  throw Error("Error testing");
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
