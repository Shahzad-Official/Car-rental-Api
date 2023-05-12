const multer = require("multer");
const path = require("path");
const { imageFilter } = require("./auth_middelware");
const brandStorage = multer.diskStorage({
    destination: "./public/images/brand_images/brand_logos",
    filename: (req, file, cb) => {
      cb(
        null,
        req.file.fieldname + Date.now() + path.extname(req.file.originalname)
      );
    },
  });

  class BrandMiddleware{
    static brandLogo = multer({
        storage: brandStorage,
        fileFilter: imageFilter,
      }).single("brandLogo");
  }
  module.exports=BrandMiddleware;