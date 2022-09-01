const jwt = require("jsonwebtoken");
const Cluster = require('../model/user');



//  exports.requireSign = async(req, res, next)=>{
//      try {
//         const token = req.cookies.jwt; 
//         const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
//         console.log(verifyUser);
//         next();

//      } catch (error) {
//          res.status(401).send(error);
//      }
//  }
exports.requireSign = function(req, res, next) {
    if (req.Cluster) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!!' });
    }
  };
  
  exports.profile = function(req, res, next) {
    if (req.Cluster) {
      res.send(req.Cluster);
      next();
    } 
    else {
     return res.status(401).json({ message: 'Invalid token' });
    }
  };