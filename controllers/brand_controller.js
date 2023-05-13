const { decode } = require("jsonwebtoken");
const Brand = require("../models/brand_model");
const fs = require("fs");

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
  
}
module.exports = BrandController;
