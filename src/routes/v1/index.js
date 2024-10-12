const express = require("express");
const router = express.Router();

const infoRoutes = require("./info-routes");
const authRoutes = require("./auth-routes");

router.use(infoRoutes);
router.use(authRoutes);

module.exports = router;
