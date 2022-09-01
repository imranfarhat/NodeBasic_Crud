const  express = require('express');
const multer =require('multer');
// var fs = require('fs');
const sharp = require('sharp');
const{
    UserRegister,
    UserLogin,
    GetAllUser,
    GetUserById,
    UpdateUser,
    requireSign,
    DeleteUserById,
    DeleteAllUser,
    vibesPaypal} =  require('../controllers/user');
    const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
    
  }, function(req, res) {
    // resize image
    resizeimage=req.file.path,
    sharp(resizeimage).resize({height: 100, width: 100}).toFile('uploads' + req.file.originalnamde, function(err) {
       if (err) {
         throw err;
       }
       // output.jpg is a 300 pixels wide and 200 pixels high image
       // containing a scaled and cropped version of input.jpg
       res.json(resizeimage);
    });
  });


  const fileFilter = (req, file, cb) => {
    // ACCEPT OR REJECT A FILE
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype === 'audio/ogg'
      || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/x-m4a' || file.mimetype === 'application/octet-stream'
      || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
    
  };
  
// STORE THIS IMAGE IN A VARIABLE TO UPLOAD TO DATABASE

const upload = multer({
    storage: storage,
    //DEFINE THE SIZE OF IMAGE
    limits: {
      fileSize: 1024 * 1024 * 1024 * 2
    },
    fileFilter: fileFilter
  });

  

router.post('/adduser', upload.single('file'), UserRegister);
router.post('/login', UserLogin);
router.get('/getuser',requireSign, GetAllUser);
router.get('/getuser/:id',requireSign, GetUserById);
router.put('/update/:id',requireSign, UpdateUser);
router.delete('/delete/:id',requireSign, DeleteUserById);
router.delete('/deleteuser',requireSign, DeleteAllUser);
router.post('/paypal',requireSign, vibesPaypal);

module.exports = router;  
