const express = require('express');
const router = express.Router();

const { isAuthenticated } = require("../middleware/authenticate");

const eventsController = require('../controllers/events');

router.get('/', eventsController.getAllevents);

module.exports = router;