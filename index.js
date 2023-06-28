const express = require("express");
const http = require("http");
const app = express();
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const carRoutes = require("./routes/car_data_routes");
const brandRoutes = require("./routes/brand_routes");
const bookingRoutes = require("./routes/booking_routes");
const errorHandler = require("./error_handler/error_handler");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");

app.use(cors());

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_URL)
  .then((value) => {
   
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
app.use("/car", carRoutes);
app.use("/brand", brandRoutes);
app.use("/booking", bookingRoutes);
app.use("/user", express.static("./public/images/profiles"));
app.use("/car", express.static("./public/images/car_images/thumbnails"));
app.use("/car", express.static("./public/images/car_images/feature_images"));
app.use("/brand", express.static("./public/images/brand_logos"));

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("User has been disconnected");
  });
});

server.listen(port, () => {
  console.log("Server is running on port" + port);
});
