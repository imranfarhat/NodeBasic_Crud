const package = require('../package.json')
const mongoose = require('mongoose');


// for locally DB///

// mongoose.connect("mongodb://localhost:27017/users", {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
//   }, (err,res)=>{
//       if(res){
//           console.log(`MogoDb Connected Successfuly at 27017 with Database Name`);
//       }if(err){
//           console.log("database is not connected")
//       }
//   });

//for live DB//
mongoose.connect("mongodb+srv://imranfarhat:sorryyar12@cluster0.zeo4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, (err,res)=>{
      if(res){
          console.log(`MogoDb Connected Successfuly at 27017 with Database Name`);
      }if(err){
          console.log (err.message)
      }
  });

  