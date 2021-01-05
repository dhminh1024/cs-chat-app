const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST api/auth/login
 * @description Login with email and password
 * @access Public
 */
router.post("/login", authController.loginWithEmail);

/**
 * @route POST api/auth/login/facebook
 * @description Login with facebook
 * @access Public
 */
router.post("/login/facebook", authController.loginWithFaceBookOrGoogle);

/**
 * @route POST api/auth/login/google
 * @description Login with google
 * @access Public
 */
router.post("/login/google", authController.loginWithFaceBookOrGoogle);

module.exports = router;
