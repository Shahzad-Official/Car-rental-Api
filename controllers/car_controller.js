const Car = require("../models/car_model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { isEmptyObject, daysToMilliseconds } = require("../utils/time_utils");

var ObjectId = require("mongoose").Types.ObjectId;

class CarController {
  static createCar = async (req, res) => {
    const {
      carname,
      brandId,
      noOfSeats,
      maxSpeed,
      pricePerDay,
      pricePerWeek,
      priceHalfWeek,
      description,
    } = req.body;

    const thumbnail = "car/" + req.file.filename;

    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.decode(token);

    const car = new Car({
      creatorId: decoded.id,
      carname: carname,
      brandId: brandId,
      thumbnail: thumbnail,

      noOfSeats: noOfSeats,
      maxSpeed: maxSpeed,
      pricePerDay: pricePerDay,
      priceHalfWeek: priceHalfWeek,
      pricePerWeek: pricePerWeek,
      description: description,
    });
    await Car.findOne({ carname: carname })
      .then(async (doc) => {
        if (doc) {
          fs.unlinkSync(req.file.path);
          res
            .status(400)
            .json({ message: "This car is already exists, Create new One!" });
        } else {
          await car
            .save()
            .then((doc) => {
              res
                .status(201)
                .json({ message: "Car data created successfully!", data: doc });
            })
            .catch((error) => {
              fs.unlinkSync(req.file.path);
              console.log(error);
              res.status(500).json({
                error: "Database error occured!",
                error: error.message,
              });
            });
        }
      })
      .catch((error) => {
        fs.unlinkSync(req.file.path);
        console.log(error);
        res
          .status(500)
          .json({ error: "Database error occured!", error: error.message });
      });
  };

  static getCars = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];

    const decoded = jwt.decode(token);

    await Car.aggregate([
      {
        $match: {
          creatorId: decoded.id,
        },
      },
      {
        $addFields: {
          creatorId: {
            $toObjectId: "$creatorId",
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: "$creator",
      },
      {
        $addFields: {
          brandId: {
            $toObjectId: "$brandId",
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
    ])
      .then((value) => {
        res.json({ message: "success", data: value, length: value.length });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching data!" });
      });
  };

  static getAllCars = async (req, res) => {
    await Car.aggregate([
      {
        $addFields: {
          creatorId: {
            $toObjectId: "$creatorId",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: "$creator",
      },
      {
        $addFields: {
          brandId: {
            $toObjectId: "$brandId",
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
    ])
      .then((value) => {
        res.json({ message: "success", data: value, length: value.length });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching data!" });
      });
  };

  static deleteCar = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];

    const decoded = jwt.decode(token);
    const query = req.query;
    if (isEmptyObject(query)) {
      res.status(400).json({ message: "carId Param is required!" });
    } else {
      if (ObjectId.isValid(query.carId)) {
        await Car.findOneAndDelete({
          _id: query.carId,
          creatorId: decoded.id,
        })
          .then((doc) => {
            if (doc) {
              res
                .status(202)
                .json({ message: "Car deleted successfully!", data: doc });
            } else {
              res.status(400).json({ message: "Car Id not found!" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ message: "Error occurred!" });
          });
      } else {
        res.status(404).json({ message: "invalid id!" });
      }
    }
  };

  
}

module.exports = CarController;
