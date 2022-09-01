const mongoose = require("mongoose");
// const bcrypt = require("bcrypt-nodejs");
// const res = require("express/lib/response");
mongoose.pluralize(null);


const UserScheema = mongoose.Schema({
  Name: {
    type: String,
    // required: true,
  },

  UserName: {
    type: String,
    // required: true,
  },

  Email: {
    type: String,
    // required: true,
    unique: true,
  },

  Mobile: {
    type: Number,
    // required: true
  },

  Password: {
    type: String,
  },
  ImageUrl: {
    type: String,
  },
  files: {
    type: String,
  },
  ImageName: {
    type: String,
  },
  ImageMimeType: {
    type: String,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  SaltString: {
    type: String,
  },
  Status: {
    type: Number,
    default: 0,
  },
  Filepath: {
    type: String,
  },
  ImageName: {
    type: String,
  },
  Type:{
    type: String,
  },
});


const saveData = mongoose.model("test", UserScheema);
module.exports = saveData;
