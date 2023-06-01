const express = require("express");
const CarController = require("../controllers/car_controller");
const CarMiddleware = require("../middlewares/car_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");


const routes = express.Router();

routes.get("/user",AuthMiddleware.tokenAuthentication,CarController.getCars);
routes.post("/",AuthMiddleware.tokenAuthentication,CarMiddleware.carThumbnail ,CarMiddleware.validateCarData,CarController.createCar);
routes.get("/",AuthMiddleware.tokenAuthentication,CarController.getAllCars);

routes.delete("/",AuthMiddleware.tokenAuthentication,CarController.deleteCar);


module.exports = routes;
