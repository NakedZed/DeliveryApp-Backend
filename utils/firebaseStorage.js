const { format } = require('util');
const catchAsync = require('./catchAsync');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const Product = require('../models/productModel');
// const { bucket } = require('./firebaseConfiguration');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'delivery-app-5e621',
  keyFilename: 'delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json',
});
let bucket = storage.bucket('gs://delivery-app-5e621.appspot.com');

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
      case 'products':
        Model = Product;
    }

    if (!req.file) {
      let createdElement = await Model.create(req.body);
      res.status(200).json({
        status: 'success',
        createdElement,
      });
    } else {
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
      case 'products':
        Model = Product;
    }
    let id =
      Model === Category
        ? req.query.categoryId
        : Model === Offer
        ? req.query.offerId
        : Model === Product
        ? req.query.productId
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
