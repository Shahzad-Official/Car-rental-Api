const express = require("express");
const CarController = require("../controllers/car_controller");
const CarMiddleware = require("../middlewares/car_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");


const routes = express.Router();

routes.post("/",AuthMiddleware.tokenAuthentication,CarMiddleware.carThumbnail ,CarMiddleware.validateCarData,CarController.createCar);
routes.get("/",AuthMiddleware.tokenAuthentication,CarController.getAllCars);
routes.get("/:brandId",AuthMiddleware.tokenAuthentication,CarController.getCarByBrand);
routes.get("/user",AuthMiddleware.tokenAuthentication,CarController.getCars);
routes.delete("/:carId",AuthMiddleware.tokenAuthentication,CarController.deleteCar);
routes.get("/", (req, res) => {
    console.log("Data Reading");
  res.json("reading data");
});

module.exports = routes;
