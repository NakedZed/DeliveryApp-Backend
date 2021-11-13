//This file contains for middleware functions to check for ID length and ID exsitence for neccessary routes

const AppError = require('./appError');
const ErrorMsgs = require('./ErrorMsgsConstants');
exports.checkForIdExistenceAndValidityProduct = (req, res, next) => {
  if (!req.query.productId) {
    return next(new AppError(ErrorMsgs.NO_PRODUCT_ID, 400));
  } else if (req.query.productId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_PRODUCT_ID, 400));
  }
  next();
};
