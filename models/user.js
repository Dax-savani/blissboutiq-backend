const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  address_1: {
    type: String,
  },
  address_2: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zipcode: {
    type: String,
    match: [/^\d{5}(-\d{4})?$/, "Please use a valid zipcode"],
  },
})

// Declare the Schema of the Mongo model

const userSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unisex'],
    validate: {
      validator: function(v) {
        return ['Male', 'Female', 'Unisex'].includes(v);
      },
      message: '{VALUE} is not a valid gender'
    }
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
  address_details: {
    type: addressSchema,
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password)
}

//Export the model
module.exports = mongoose.model("User", userSchema);
