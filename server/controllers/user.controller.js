const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Conversation = require("../models/Conversation");
const emailHelper = require("../helpers/email.helper");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarUrl } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(400, "User already exists", "Registration Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
  });
  const accessToken = await user.generateToken();

  const emailData = await emailHelper.renderEmailTemplate(
    "welcome_email",
    { name: name },
    email
  );

  if (!emailData.error) {
    emailHelper.send(emailData);
  }

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user)
    return next(new AppError(400, "User not found", "Get Current User Error"));
  return sendResponse(res, 200, true, user, null, "Get current user sucessful");
});

userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = req.query;

  const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalNumUsers = await User.find({ ...filter }).countDocuments();
  const totalPages = Math.ceil(totalNumUsers / limit);
  const offset = limit * (page - 1);

  const users = await User.find({ ...filter })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { users, totalPages }, null, "");
});

userController.getConversationList = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;

  const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalNumConversation = await Conversation.find({
    users: currentUserId,
  }).countDocuments();
  const totalPages = Math.ceil(totalNumConversation / limit);
  const offset = limit * (page - 1);

  let conversations = await Conversation.find({
    users: currentUserId,
  })
    .sort({ updatedAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("users");

  return sendResponse(
    res,
    200,
    true,
    { conversations, totalPages },
    null,
    null
  );
});

module.exports = userController;
