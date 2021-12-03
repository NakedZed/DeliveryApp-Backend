const catchAsync = require('../utils/catchAsync');
const Service = require('../models/serviceModel');

//@desc Create service
//@route POST /api/v1/services/service
//access PUBLIC
exports.createService = catchAsync(async (req, res, next) => {
  let service = await Service.create(req.body);
  res.status(200).json({
    status: 'success',
    service,
  });
});

exports.getAllServices = catchAsync(async (req, res, next) => {
  let services = await Service.find();
  res.status(200).json({
    status: 'success',
    services,
  });
});
