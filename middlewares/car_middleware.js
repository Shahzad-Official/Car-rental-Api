const multer = require("multer");
const path = require("path");
const { imageFilter } = require("./auth_middelware");

const thumbnailStorage = multer.diskStorage({
  destination: "./public/images/car_images/thumbnails",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});



class CarMiddleware {
 
  static carThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: imageFilter,
  }).single("thumbnail");
  static validateCarData=(req,res,next)=>{
    if(req.file==null){
      res.status(404).json({error:"thumbnail field is required!"});
    }else{
      next();
      
    }
  }


  


}

module.exports = CarMiddleware;
