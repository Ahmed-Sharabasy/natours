const express = require("express");
const userController = require("../controllers/userController.js");

const router = express.Router();

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser);

// export one thing only
module.exports = router;
