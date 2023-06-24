const express = require('express');

const { AuthMiddleware } = require('../middlewares/auth_middelware');
const BookingController = require('../controllers/booking_controller');


const router=express.Router();

router.post("/",AuthMiddleware.tokenAuthentication,BookingController.bookCar,);
router.get("/",AuthMiddleware.tokenAuthentication,BookingController.getMyBookings);

module.exports=router;