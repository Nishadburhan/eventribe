const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");
const eventController = require('../../controllers/eventController');



router.use("/users", userController);
router.use("/events", eventController);

module.exports = router;