const express = require("express");
const app = express();
const router = require("./routes/auth");
const errorHandler = require("./error_handler/error_handler");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const Test = require("./models/test");

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
app.post("/test", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  var testData = new Test({
    name: name,
    age: age,
  });
  testData
    .save()
    .then((value) => {
      res.json(value);
    })
    .catch((err) => {
      throw Error(err);
    });
});
app.use(errorHandler);

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
