const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please Provide a password"],
    minLength: 6,
    select: false,
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(15);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.getSignedToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
