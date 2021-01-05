const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const authController = {};

authController.loginWithEmail = catchAsync((req, res, next) => {});

authController.loginWithFaceBookOrGoogle = catchAsync((req, res, next) => {});

module.exports = authController;
