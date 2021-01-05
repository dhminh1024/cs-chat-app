var express = require("express");
var router = express.Router();

const userApi = require("./user.api");
router.use("/users", userApi);

const authApi = require("./auth.api");
router.use("/auth", authApi);

const conversationApi = require("./conversation.api");
router.use("/conversations", conversationApi);

module.exports = router;
