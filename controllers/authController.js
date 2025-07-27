const jwt = require("jsonwebtoken");

const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // 365d
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser.id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: { newUser },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  // 1) Check If email and password exist
  if (!email || !password) {
    return next(new AppError("enter email and password", 404));
  }

  // 2) Check If user exist and password is correct
  //.select("+password")=> to select password beacuse you but {select: false} in password schema field
  const user = await User.findOne({ email }).select("+password");

  // prettier-ignore
  if (!user || !(await user.checkPasswordIsTheSameOrNot(password , user.password))){
    // 401 faild in auth
    return next(new AppError('invalied user or password' , 401))
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
