const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./public/upload",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    return cb(null, true);
  } else {
    
    return cb(Error("only images are allowed"));
  }
};
const videoFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "mp4" || extension === "mkv" || extension === "mov") {
    return cb(null, true);
  } else {
    return cb(Error("only videos are allowed"));
  }
};
class AuthMiddleware {
  static imageMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
  }).single("image");

  static videoMiddleware = multer({
    storage: storage,
    fileFilter: videoFilter,
  }).single("video");
}
module.exports = AuthMiddleware;
