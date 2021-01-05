const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

/**
 * @route GET api/conversations
 * @description Get list of conversations of current user
 * @access Login required
 */
router.get("/", userController.getConversationList);

module.exports = router;
