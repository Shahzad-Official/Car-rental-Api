const express = require("express");
const BrandController = require("../controllers/brand_controller");
const BrandMiddleware = require("../middlewares/brand_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");
const routes = express.Router();

routes.post(
  "/",
  AuthMiddleware.tokenAuthentication,
  BrandMiddleware.brandLogo,
  BrandMiddleware.brandInfoMiddleware,
  BrandController.createBrand
);


routes.get("/",AuthMiddleware.tokenAuthentication, BrandController.allBrands);
routes.get("/cars",AuthMiddleware.tokenAuthentication, BrandController.getCarByBrand);
routes.get("/user",AuthMiddleware.tokenAuthentication, BrandController.userBrands);

module.exports = routes;
