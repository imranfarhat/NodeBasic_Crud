const userCluster = require("../models/user");
const fs = require("fs");
const stripe = require('stripe');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const SaltRounds = 10;
require('dotenv').config();

// var upload = multer();
const {SendEmailUsingNodeMailer}=require('../emailTemplete/email');

// for paypal
const paypal = require("paypal-rest-sdk");
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.paypal_client_id,
    'client_secret': process.env.paypal_secret_key
});

exports.UserRegister = async (req, res) => {
  console.log(req.body);
  try {
    const userExists =await userCluster.findOne({ Email: req.body.email });
    var hashPassword = bcrypt.hashSync(req.body.password);
    bcrypt.genSalt(SaltRounds,(err,salt)=>{
      if(salt){
      this.SaltString=salt;
      }
    });
  
    if (userExists) {
      res.json({
        message: "User With this Email ID is Already Exist!",
      });
      
    } else {


      const UserregistertoSave = await new userCluster({
        Name: req.body.name,
        UserName: req.body.username,
        Email: req.body.email,
        Mobile: req.body.mobile,
        // Filepath: req.files[0].filename,
        file: req.body.file,
        // ImageName: req.file.filename,
        // Type: req.file.mimetype,
        Password: hashPassword,
      });

    await UserregistertoSave.save();
    const sendEmailforUserRegistration = await SendEmailUsingNodeMailer(req.body.email);
    console.log(UserregistertoSave,sendEmailforUserRegistration)
    res.json({
        message:"User Register Sucessfully",
        Data: true,
        Result: UserregistertoSave,sendEmailforUserRegistration,
    })
  }
  } catch (error) {
    console.log(error.message)
    return res.json({
      message: error.message,
     
    });
  }
};

exports.UserLogin = async (req, res) => {
  try {
    getEmail = req.body.email,
    Password = req.body.password
    console.log(req.body)

    const UserAuthinticate = await userCluster.findOne({Email: getEmail});
    if (UserAuthinticate === null) {
      res.json({
        Message: "Authentication Failed Either Incorrect Email",
        Result: null,
      })
    }
    console.log(UserAuthinticate.Password);
    const Result = bcrypt.compareSync(Password, UserAuthinticate.Password);
    console.log(Result);
    
    if (Result === false) {
      res.json({
        message: "Authentication Failed Either Incorrect Password",
        Data: "Not Found",
        Result: null,
      });
    }
    // console.log("Password Compare");
    
    const Token = jwt.sign(
      {
        Email: UserAuthinticate.email,
        UserId: UserAuthinticate.id,
      }, 
      "UserLogin",
      { expiresIn: "3h" }
      
    );
    // res.cookie("jwt", Token,{
    //     expires:new Date(Date.now() + 600000),
    //   })
    return res.json({
      message: "user Login Sucessfully",
      Data: true,
      Token: Token,
    });
  } catch (error) {
    return res.json({
      Error: error.message,
      Data: null,
    });
  }
};

exports.requireSign = function(req, res, next) {
  const token = req.headers["authorization"];
console.log(req.headers)
console.log(token)
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "UserLogin");
    req.user = decoded;
  } catch (err) {
    console.log(err)
    return res.status(401).send("Invalid Token");
  }
  return next();
};



exports.GetAllUser = async (req, res, next) => {
  try {
    const getuser = await userCluster.find().sort({created:-1})
   
    if (getuser.length <= 0) {
      return res.json({
        message: "user not Found",
      });
    }
    if (getuser.length > 0) {
      return res.json({
        message: "All User Found Sucessfully",
        Data: true,
        Result: getuser,
      });
    }
  } catch (error) {
    return res.status(401).json({
      Error: error.message,
    });
  }
};

exports.GetUserById = async (req, res) => {
  try {
    const getId = req.params.id;
    const GetUser = await userCluster.findById({ _id: getId }).sort({created: -1})
    .populate("Name", "_id Name Email ")
    if (GetUser === null) {
      return res.json({
        message: "user not found",
      });
    }
    if (GetUser !== null) {
      return res.json({
        message: "user found this Id",
        Data: true,
        Ressult: GetUser,
      });
    }
  } catch (error) {
    return res.json({
      Error: error.message,
    });
  }
};


exports.UpdateUser = async (req, res) => {

  try {

    var hashPassword = bcrypt.hashSync(req.body.Password);
    bcrypt.genSalt(SaltRounds,(err,salt)=>{
      if(salt){
      this.SaltString=salt;
      }
    })

    const GetId = req.params.id;
    const UserregistertoSave = {
      Name: req.body.Name,
      UserName: req.body.UserName,
      Email: req.body.Email,
      Mobile: req.body.Mobile,
      Password: hashPassword
    };
    console.log(UserregistertoSave);
  
    const UpdateById = await userCluster.updateOne({_id: GetId}, {$set: UserregistertoSave});
  
    res.json({
      message: "user Updated",
      Data: true,
      Result: UserregistertoSave
    });

  } catch (error) {
    res.json({
      Error: error.message,
      });
  }
  };

exports.DeleteUserById = async (req, res) => {
  try {
    const GetId = req.params.id;
    const DeleteUser = await userCluster.findByIdAndDelete({ _id: GetId });
    console.log(DeleteUser)
    if (DeleteUser === null) {
      res.json({
        message: "user not found",
        Data: false,
        Result: null,
      });
    } 
    if (DeleteUser !== null ){
      res.json({
        message:"user delete sucessfully",
        Data: true,
        Result: DeleteUser,
      })
      
    }
  } catch (error) {
    res.json({
      Error: error.message,
      
    });
  }
};

exports.DeleteAllUser = async (req, res) => {
  try {
    const getuser = await userCluster.deleteMany();

    return res.json({
      message: "All user delete sucessfully",
      Data: true,
      Result: getuser
    }) 
   
  } catch (error) {
    return res.status(401).json({
      Error: error.message,
    });
  }
};


exports.PayWithStripe = async(req, res) => {

  var getname = req.body.name;
  var getcurrency = req.body.currency; 
  var getamount = req.body.price;

try {

  session = stripe.create({
    line_items: [{
     
                  "name": getname,
                  "sku": "001",
                  "price": getamount,
                  "currency": getcurrency,
                  "quantity": 1
    }],
    mode: 'payment',
    success_url: YOUR_DOMAIN + '/success.html',
    cancel_url: YOUR_DOMAIN + '/cancel.html',
  })
  
} catch (error) {
  
}
}



exports.vibesPaypal = async (req, res) => {
  console.log(process.env.paypal_client_id);

  var getname = req.body.name;
  var getcurrency = req.body.currency; 
  var getamount = req.body.price;


  const create_payment_json = await {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:4000/success",
          "cancel_url": "http://localhost:4000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": getname,
                  "sku": "001",
                  "price": getamount,
                  "currency": getcurrency,
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": getcurrency,
              "total": getamount
          },
          "description": getname
      }]
  };


  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          res.json({
              Error: error
          });
      } else {
          for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                  // res.redirect(payment.links[i].href);
                  res.json({
                      paymentLinks: payment.links[i].href,
                      Message: 'Approved'
                  })
              }
          }

      }
  });

};

