const express = require("express");
const CarController = require("../controllers/car_controller");
const CarMiddleware = require("../middlewares/car_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");


const routes = express.Router();

routes.post("/createCar",AuthMiddleware.tokenAuthentication,CarMiddleware.carThumbnail ,CarMiddleware.validateCarData,CarController.createCar);
routes.get("/allCars",AuthMiddleware.tokenAuthentication,CarController.getAllCars);
routes.get("/allCars/:brandId",AuthMiddleware.tokenAuthentication,CarController.getCarByBrand);
routes.get("/myCars",AuthMiddleware.tokenAuthentication,CarController.getMyCars);

routes.get("/", (req, res) => {
    console.log("Data Reading");
  res.json("reading data");
});

module.exports = routes;
