const Brand = require("../models/brand_model");
const Car = require("../models/car_model");
const jwt = require("jsonwebtoken");

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
    const { thumbnail } = "thumbnail/" + req.file.filename;
    const { featureImages } = req.files;
    let allImages = [];

    featureImages.forEach((element) => {
      allImages.push("featurImage/" + element.filename);
    });
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.decode(token);
    res.json(decoded);
    // const car = new Car({
    //   creatorId:decoded.id,
    //   carname: carname,
    //   brandId: brandId,
    //   thumbnail: thumbnail,
    //   featureImages: allImages,
    //   noOfSeats: noOfSeats,
    //   maxSpeed: maxSpeed,
    //   pricePerDay: pricePerDay,
    //   priceHalfWeek: priceHalfWeek,
    //   pricePerWeek: pricePerWeek,
    //   description: description,
    // });
    // await car
    //   .save()
    //   .then((doc) => {
    //     res
    //       .status(201)
    //       .json({ message: "Car data created successfully!", data: doc });
    //   })
    //   .catch((error) => {
    //     res
    //       .status(500)
    //       .json({ error: "Database error occured!", error: error.message });
    //   });
  };
  static getCarByBrand = async (req, res) => {
    const brandId = "";
    await Car.find({ brandId: brandId })
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error occured while fetching data!" });
      });
  };
  static getAllCars = async (req, res) => {
    await Car.find()
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching data!" });
      });
  };
}
module.exports = CarController;
