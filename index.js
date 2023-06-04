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

const socketIO = require('socket.io');
const cors = require('cors');
app.use(cors());


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
app.use("/car", carRoutes);
app.use("/brand", brandRoutes);
app.use("/user", express.static("./public/images/profiles"));
app.use("/car", express.static("./public/images/car_images/thumbnails"));
app.use("/car", express.static("./public/images/car_images/feature_images"));
app.use("/brand", express.static("./public/images/brand_logos"));



app.use(errorHandler);

  
let allMessages=[];
const server = app.listen(port, () => {
  console.log('Server is running on port'+ port);
});

const io = socketIO(server, {
  cors: {
    origin: 'http://52.146.8.104:5000', // Replace with your Flutter app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat_message', (message) => {
    console.log('Received message:', message);
    allMessages.push(message);
    console.log(allMessages);
    io.emit("my_messages",allMessages);
  });
  

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

