const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: 0,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    salt: String,
  },
  { timestamps: true }
);


// virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1(); // unique id generator
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    this._password;
  });
  
  // method
  userSchema.methods = {
    encryptPassword: function (password) {
      if (!password) {
        return "";
      } else {
        try {
          return crypto
          .createHmac("sha256", this.salt)
          .update(password)
          .digest("hex");
        } catch(error) {
          return error;
        }
      }
    },
    
    authenticate: function (plaintext) {
      return this.encryptPassword(plaintext) === this.hashed_password;
    },
  };

  module.exports = mongoose.model("User", userSchema);