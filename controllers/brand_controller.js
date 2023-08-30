const { decode } = require("jsonwebtoken");
const Brand = require("../models/brand_model");
const fs = require("fs");
const { isEmptyObject } = require("../utils/time_utils");
const Car = require("../models/car_model");

class BrandController {
  static createBrand = async (req, res) => {
    const { name, logo } = req.body;
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenData = decode(token);

    const userId = tokenData.id;

    const brand = new Brand({
      name: name,
      logo: "brand/" + req.file.filename,
      creatorId: tokenData.id,
    });
    await brand
      .save()
      .then((result) => {
        res
          .status(201)
          .json({ message: "Brand created successfully!", data: result });
      })
      .catch((error) => {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      });
  };
  static userBrands = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenData = decode(token);
    await Brand.find({ creatorId: tokenData.id })
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({ error: "Error while fetching data!" });
      });
  };
  static allBrands = async (req, res) => {
    await Brand.find()
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({ error: "Error while fetching data!" });
      });
  };

  static getCarByBrand = async (req, res) => {
    const query = req.query;

    if (isEmptyObject(query)) {
      res.status(400).json({ message: "brand parameter is required!" });
    } else {
      await Car.aggregate([
       
        {
          $match: {
            brandId: query.brand,
          },
        },
      
        {
          $addFields: {
            creatorId: {
              $toObjectId: "$creatorId",
            },
            brandId:{
              $toObjectId:"$brandId",
            },
          },
        },
        {
          $lookup: {
            from: "users",
            as: "creator",
            foreignField: "_id",
            localField: "creatorId",
          },
        },
        { $unwind: "$creator" },
        {
          $lookup: {
            from: "brands",
            as: "brand",
            foreignField: "_id",
            localField: "brandId",
          },
        },
        { $unwind: "$brand" },
      ])
        .then((value) => {
          res.json({ message: "success", data: value, length: value.length });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Error fetching data!" });
        });
    }
  };
}
module.exports = BrandController;
