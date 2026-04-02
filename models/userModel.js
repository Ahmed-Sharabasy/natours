const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a passwordConfirm'],
    validate: {
      // this only works on save!
      validator: function (el) {
        return el === this.password;
      },
      message: 'please write pass correctly',
    },
  },

  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'leads-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,

  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

// all words start with find do : select only doc with prob active = true
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  // Work only when pass is modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // degree of incrypt 12
  // delete passwordConfirm from db
  this.passwordConfirm = undefined;
  next();
});

// change passwordChangedAt prob if password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// prettier-ignore
userSchema.methods.checkPasswordIsTheSameOrNot = async function (password , userPassword) {
  return await bcrypt.compare(password, userPassword)
}

// check if password changed after token was signed of not
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    let passwordChangedDate = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < passwordChangedDate;
  }
  return false;
};

// create pass reset token , expires and save them in db
userSchema.methods.createResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // after 10 min from now in utc f
  // to make the date like my computer
  // new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()
  return resetToken;
};

// delete mongoose.models.User;
// const User = mongoose.model('User', userSchema);

// const User = mongoose.model('User', userSchema);
// another way
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
