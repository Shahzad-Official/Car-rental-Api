const multer=require("multer");
const path=require("path");
const storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            console.log(file);
            cb(null,"../public/upload");
        },
        filename:(req,file,cb)=>{
            console.log(file);
            cb(null,file.fieldname+Date.now()+path.extname(file.originalname));
        },
    }
);

const fileFilter=((req,file,cb)=>{
    const extension=path.extname(file.originalname).split(".")[1];
if(extension==="png"||extension==="jpg"||extension==="jpeg"){
    return cb(null);
}else{
    return cb(Error("only images are allowed"));
}
});
class AuthMiddleware{
  static  singleImageMiddleware=multer({storage:storage,fileFilter:fileFilter}).single("file");
  static  multiImageMiddleware=multer({storage:storage,fileFilter:fileFilter}).array("file");
}
module.exports=AuthMiddleware;