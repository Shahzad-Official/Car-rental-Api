const express = require("express");
const BrandController = require("../controllers/brand_controller");
const BrandMiddleware = require("../middlewares/brand_middleware");
const { AuthMiddleware } = require("../middlewares/auth_middelware");
const routes = express.Router();

routes.post(
  "/createBrand",
  AuthMiddleware.tokenAuthentication,
  BrandMiddleware.brandLogo,
  BrandController.createBrand
);

routes.get("/myBrands", BrandController.userBrands);

module.exports = routes;
