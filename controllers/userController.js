const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
);
// console.log(users);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { users },
  });
};

// "5c8a1d5b0190b214360dc057"
exports.getUser = (req, res) => {
  const id = req.params.id;
  const userAcc = users.find((el) => el._id === id);
  console.log(userAcc);
  res.status(200).json({
    status: 'success',
    data: { userAcc },
  });
};
