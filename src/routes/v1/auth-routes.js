const express = require("express");
const router = express.Router();
const { AuthController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

router.post(
  "/auth/sign-up",
  [AuthMiddleware.authMiddleware],
  AuthController.signUp
);
router.post(
  "/auth/sign-in",
  [AuthMiddleware.authMiddleware],
  AuthController.signIn
);

module.exports = router;
