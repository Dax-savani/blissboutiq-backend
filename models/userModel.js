const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model

var userSchema = new mongoose.Schema({
  salutation: {
    type: String,
    enum: ["Mr", "Mrs", "Ms"],
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

//Export the model
module.exports = mongoose.model("User", userSchema);
