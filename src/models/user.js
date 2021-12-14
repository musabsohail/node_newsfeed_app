const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.isUserEmail = async function (findByKey, value) {
  const user = await this.findOne({ [findByKey]: value });
  return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
