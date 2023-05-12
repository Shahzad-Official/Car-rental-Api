const { decode } = require("jsonwebtoken");
const Brand = require("../models/brand_model");

class BrandController {
    static createBrand = async (req, res) => {
        const { name, logo } = req.body;
        const token = req.headers.authorization.split("Bearer ")[1];
    const tokenData = decode(token);
        res.json(tokenData);
        // const brand = new Brand({
        //   name: name,
        //   logo: "brandLogo/" + req.file.filename,
        //   creatorId: tokenData.id,
        // });
        // await brand
        //   .save()
        //   .then((result) => {
        //     res
        //       .status(201)
        //       .json({ message: "Brand created successfully!", data: result });
        //   })
        //   .catch((error) => {
        //     res.status(500).json({ error: "Error occured in database! " });
        //   });
      };
  static userBrands = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenData = decode(token);
    // await Brand.find({ creatorId: tokenData.id })
    //   .then((docs) => {
    //     res.json({ message: "success", data: docs });
    //   })
    //   .catch((err) => {
    //     console.log(err),
    //       res.status(500).json({ error: "Error while fetching data!" });
    //   });
  };
}
module.exports = BrandController;
