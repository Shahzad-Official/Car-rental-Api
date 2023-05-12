const multer = require("multer");
const path = require("path");
const { imageFilter } = require("./auth_middelware");

const thumbnailStorage = multer.diskStorage({
  destination: "./public/images/car_images/thumbnails",
  filename: (req, file, cb) => {
    cb(
      null,
      req.file.fieldname + Date.now() + path.extname(req.file.originalname)
    );
  },
});

const featureImagesStorage = multer.diskStorage({
  destination: "./public/images/car_images/feature_images",
  filename: (req, file, cb) => {
    req.files.forEach((element) => {
      cb(
        null,
        "FeatureImage_" + Date.now() + path.extname(element.originalname)
      );
    });
  },
});

class CarMiddleware {
 
  static carThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: imageFilter,
  }).single("thumbnail");
  static carFeatureImages = multer({
    storage: thumbnailStorage,
    fileFilter: imageFilter,
  }).array("featureImages");
}

module.exports = CarMiddleware;
