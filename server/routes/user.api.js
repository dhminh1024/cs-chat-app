const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", userController.getCurrentUser);

/**
 * @route GET api/users
 * @description Get list of all users
 * @access Login required
 */
router.get("/", userController.getUsers);

/**
 * @route POST api/users
 * @description Register new account
 * @access Public
 */
router.post("/", userController.register);

module.exports = router;
