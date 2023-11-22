const express = require("express");
const rateLimit = require("express-rate-limit");
const http = require("http");
const axios = require("axios");

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

const admin = require("firebase-admin");

const credentials=require("./serviceKey.json");

admin.initializeApp({
  credential:admin.credential.cert(credentials),
});

app.use(cors());

const port = process.env.PORT || 3000;
const otpGenerator=require("otp-generator");
mongoose
  .connect(process.env.DB_URL)
  .then((value) => {
    console.log("connected");
  })
  .catch((err) => {
    throw Error(err);
  });


app.use("/send_otp", (req,res)=>{
  const auth = admin.auth();

const phoneNumber = '+1234567890'; // Replace with the user's phone number


auth
  .generatePhoneVerificationCode(phoneNumber)
  .then((verificationCode) => {
    res.json({message:"otp has been sent",otp:verificationCode});
    // Send the verificationCode to the user via SMS or any other method
    console.log(`Verification code sent: ${verificationCode}`);
  })
  .catch((error) => {
    console.error('Error sending verification code:', error);
  });
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
app.post("/sendSMS", async (req, res) => {
  var originalNum=req.body.phone;
  var removeChar="+";
  var numArray=originalNum.split(removeChar);
  var phoneNum=numArray.join("");
  console.log(phoneNum);
 var otp= otpGenerator.generate(6,{digits:true,lowerCaseAlphabets:false,specialChars:false,upperCaseAlphabets:false});
  try{
    var response=await axios
    .get("http://185.192.96.202/api.php?type=text-message&token=dbc51dc7c506f12e64b1&instance=9871880b-e385-49c2-bf8b-6c5aad1ec9fc&phone="+phoneNum+"&message=*MUSHWARI* Sent You One Time Passcode _*"+otp+"*_ Is Valid For 5 Minutes.", {
    
      headers: {
        "Content-Type": "application/json",
      },
    });
    var data=response.data;
    
    if(data&&!data.error){
      res.json({data:data,otp:otp,message:data.msg});
    }else{
      res.status(400).json({message:"some Error"});
    }
  } catch (error) {
    // Handle errors here
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
  
});
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("User has been disconnected");
  });
});

server.listen(port, () => {
  console.log("Server is running on port" + port);
});
