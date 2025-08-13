const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // promisify builtin node m used to return promise from opp

const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const sendEmail = require('../utils/email.js');

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
    passwordChangedAt: req.body.passwordChangedAt || undefined,
    role: req.body.role || undefined,
  });
  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
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
    return next(new AppError('enter email and password', 404));
  }
  // 2) Check If user exist and password is correct
  //.select("+password")=> to select password beacuse you but {select: false} in password schema field
  const user = await User.findOne({ email }).select('+password');
  // prettier-ignore
  if (!user || !(await user.checkPasswordIsTheSameOrNot(password , user.password))){
    // 401 faild in auth
    return next(new AppError('invalied user or password' , 401))
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// Protected Route Function To make sure user is Auth
exports.protect = catchAsync(async (req, res, next) => {
  //1) check if token founded in req
  let token;
  // prettier-ignore
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new AppError('you Are not logged in please Log In!', 401));
  console.log(token);
  //2) verification the token
  // promisify(jwt.verify) return function ,afterthen await call this func with (token, peJ_SCRET) params
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3) check if user still exist ex(still in db)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('no user found in db', 401));
  console.log(currentUser);
  //4) check if user changed his pass after jwt token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user changed his password , enter new passwod', 401)
    );
  }
  // Grant Access To the Protected Route
  // save the current User to req.user for later use
  req.user = currentUser;
  next();
});

// check Who Have Permisions to do this job
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles:["user", "guide", "leads-guide", "admin"] => role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('user not Authorized to do this Action', 403));
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //1) Get User Based On Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user or email not founded', 404));
  }

  //2) generate random token
  const resetToken = await user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) send the token using by email using nodemailer
  // prettier-ignore
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
  console.log(resetURL);

  const message = `forget password enter the link to reset pass ${resetURL}`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'token expiress in 10 min',
      text: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('there are an err in send email try again ', 500));
  }
  res.status(200).json({
    status: 'success',
    message: 'token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {},
  });
});
