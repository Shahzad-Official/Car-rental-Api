const Bookings = require("../models/booking_model");
const jwt = require("jsonwebtoken");

class BookingController {
  static bookCar = (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];

    const decoded = jwt.decode(token);
    const { carId, bookedOn, expiredOn, duration } = req.body;
    const booking = new Bookings({
      carId: carId,
      userId: decoded.id,

      bookedOn: bookedOn,
      expiredOn: expiredOn,
      duration: duration,
    });
    booking
      .save()
      .then((val) => {
        res.json({
          message: "Car has been booked Successfully!",
          data: val,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Database error occured!",
          error: err.message,
        });
      });
  };

  static getMyBookings = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];

    const decoded = jwt.decode(token);
    await Bookings.aggregate([
      { $match: { userId: decoded.id } },
      {
        $addFields: {
          userId: {
            $toObjectId: "$userId",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $addFields: {
          carId: {
            $toObjectId: "$carId",
          },
        },
      },
      {
        $lookup: {
          from: "cars",
          localField: "carId",
          foreignField: "_id",
          as: "carData",
        },
      },
      {
        $unwind: "$carData",
      },

      {
        $addFields: {
          "carData.brandId": {
            $toObjectId: "$carData.brandId",
          },
        },
      },

      {
        $lookup: {
          from: "brands",
          localField: "carData.brandId",
          foreignField: "_id",
          as: "brandData",
        },
      },
      {
        $unwind: "$brandData",
      },
    ])
      .then((docs) => {
        if (docs.length === 0) {
          res.json({ message: "No data found" });
        } else {
          res.json({ data: docs, length: docs.length });
        }
      })
      .catch((err) => {
        console.log("booking Error=>" + err);
        res.status(500).json(err);
      });
  };
}

module.exports = BookingController;
