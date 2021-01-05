const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const userController = {};

userController.register = catchAsync((req, res, next) => {});

userController.getCurrentUser = catchAsync((req, res, next) => {});

userController.getUsers = catchAsync((req, res, next) => {});

userController.getConversationList = catchAsync((req, res, next) => {});

module.exports = userController;
