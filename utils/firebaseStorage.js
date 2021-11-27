const { format } = require('util');
const catchAsync = require('./catchAsync');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const { bucket } = require('./firebaseConfiguration');

exports.handleStoringImageAndCreatingElement = catchAsync(
  async (schemaType, req, res) => {
    let Model;
    switch (schemaType) {
      case 'categories':
        Model = Category;
        break;
      case 'offers':
        Model = Offer;
        break;
    }
    const blob = bucket.file(`${schemaType}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();
    blobStream.on('finish', async () => {
      // The public URL can be used to directly access the file via HTTP.
      publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
    });
    let photoUrl = `https://storage.googleapis.com/${bucket.name}/${schemaType}/${req.file.originalname}`;
    let wholeBody = { ...req.body, photo: photoUrl };
    let createdElement = await Model.create(wholeBody);
    res.status(200).json({
      status: 'success',
      createdElement,
    });
    blobStream.end(req.file.buffer);
  }
);
exports.handleUpdatingAndStoringElement = catchAsync(
  async (schemaType, req, res) => {
    let Model;

    switch (schemaType) {
      case 'categories':
        Model = Category;
        break;
      case 'offers':
        Model = Offer;
        break;
    }
    let id =
      Model === Category
        ? req.query.categoryId
        : Model === Offer
        ? req.query.offerId
        : (id = id);
    if (req.file) {
      const blob = bucket.file(`${schemaType}/${req.file.originalname}`);
      const blobStream = blob.createWriteStream();
      blobStream.on('finish', async () => {
        // The public URL can be used to directly access the file via HTTP.
        publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
      });
      let photoUrl = `https://storage.googleapis.com/${bucket.name}/${schemaType}/${req.file.originalname}`;
      let wholeBody = { ...req.body, photo: photoUrl };

      let updatedElement = await Model.findOneAndUpdate(
        { _id: id },
        wholeBody,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: 'success',
        updatedElement,
      });
      blobStream.end(req.file.buffer);
    } else {
      let updatedElement = await Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: 'success',
        updatedElement,
      });
    }
  }
);
