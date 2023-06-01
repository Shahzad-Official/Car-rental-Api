const Car = require("../models/car_model");
const jwt = require("jsonwebtoken");
const fs = require("fs");

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
    await Car.findOne({ carname: carname }).then(async (doc) => {
      if (doc) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ message: "This car is already exists, Create new One!" });
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
            res
              .status(500)
              .json({ error: "Database error occured!", error: error.message });
          });
      }
    }).catch((error) => {
      fs.unlinkSync(req.file.path);
      console.log(error);
      res
        .status(500)
        .json({ error: "Database error occured!", error: error.message });
    });;
  };
  static getCarByBrand = async (req, res) => {
    const brandId = req.params.brandId;

    await Car.find({ brandId: brandId })
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error occured while fetching data!" });
      });
  };


  static getCars = async (req, res) => {
//     const token = req.headers.authorization.split("Bearer ")[1];
// console.log(token);
//     const decoded = jwt.decode(token);

res.json("hello");
    // await Car.find({ creatorId: decoded.id })
    //   .then((docs) => {
    //     if(docs){
    //       res.json({ message: "success", data: docs });
    //     }else{
    //       res.status(404).json({message:"Data not found!",data:[]});
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).json({ error: "Error occured while fetching data!" });
    //   });
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


  static deleteCar=async(req,res)=>{
    const token = req.headers.authorization.split("Bearer ")[1];

    const decoded = jwt.decode(token);
    const id=req.params.carId;
    await Car.findOneAndDelete({
      _id:id,
      creatorId: decoded.id,
    }).then((doc)=>{
      if(doc){
       res.status(202).json({message:"Car deleted successfully!",data:doc});
      }else{
        res.status(204).json({message:"Car Id not found!"});
      }
    }).catch((err)=>{
    res.status(404).json({message:"Error occurred!"});
    })
  };


}
module.exports = CarController;
