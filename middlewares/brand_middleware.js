const multer = require("multer");
const path = require("path");
const { imageFilter } = require("./auth_middelware");
const Brand = require("../models/brand_model");
const fs=require("fs");


const brandStorage = multer.diskStorage({
  destination: "./public/images/brand_logos",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

class BrandMiddleware {
  static brandLogo = multer({
    storage: brandStorage,
    fileFilter: imageFilter,
  }).single("brandLogo");
 static brandInfoMiddleware = (req, res, next) => {

    Brand.findOne({ name: req.body.name })
      .then((doc) => {
          if(!doc){
            if(req.file==null){
              res.status(404).json({error:"brandLogo is required field!"});
            }else{
              next();
            }

          }else{
            fs.unlinkSync(req.file.path);
            res.status(403).json({error:"This brand name is already exist!"});
          }

      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "database error" });
      });
  };
}
module.exports = BrandMiddleware;
