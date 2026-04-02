const fs = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactory.js');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
// );
// console.log(users);
//   const user = await User.findById({ _id: req.user.id });

// filter arg methed
const filterObj = function (data, ...arg) {
  const filterdDataObj = {};
  const keys = Object.keys(data);
  console.log(keys);
  // only update user prob by value we want
  keys.forEach((key) => {
    if (arg.includes(key)) filterdDataObj[key] = data[key];
  });
  return filterdDataObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) if user posted password to change return error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('you cant change your password route another route', 401)
    );
  }
  //2) filter arg you want to change
  const filterBody = filterObj(req.body, 'name', 'email');

  //3) update the data
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    filterBody,
    data: { user },
  });
});

// Delete User : this when user delete himself
exports.deleteMe = catchAsync(async (req, res, next) => {
  //1) set prob of user active = false
  // const user = await User.findByIdAndUpdate(req.user.id, filterBody,{runValidators: true,new: true});
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

// this for admins
exports.deleteUser = factory.deleteOne(User); // Work on this Function Later

//! Do NOT update passwords with this ?(MiddleWare validators dosnt work)
exports.updateUser = factory.updateOne(User); // Work on this Function Later

// MiddleWare to get current user id from protected auth fun
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
