const catchAsync = require('../utils/catchAsync');
const Favorite = require('../models/favoriteModel');

//@desc add favorite shops for user
//@route POST /api/v1/shops/shop => pass shopIds array in the body and the userId in the query
//access PUBLIC
// exports.addShopForUserInFavorites = catchAsync(async (req, res, next) => {
//   req.body.user = req.query.userId;

//   //Req.body.shopIds === shops needed to be favorite
//   req.body.favoriteShops = [...req.body.shopIds];

//   let favorite = await Favorite.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     favorite,
//   });
// });

//@desc Get favorite shops for user ==> By providing userid in query
//@route GET /api/v1/favorites/favorite
//access PUBLIC
exports.getFavoriteShopsForUser = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  let favorite = await Favorite.findOne({ user: userId });

  res.status(200).json({
    status: 'success',
    favoriteShops: favorite.favoriteShops,
  });
});
//@desc Remove favorite shops for user ==> By providing userid in query and array of favorite shops to be removed
//@route PACTCH /api/v1/favorites/favorite
//access PUBLIC
// exports.removeShopForFavorites = catchAsync(async (req, res, next) => {
//   let favorite = await Favorite.findOne({ user: req.query.userId });
//   let favoriteShops = favorite.favoriteShops;
//   let shopsToBeRemoved = req.body.shopIds;
//   let newFavoriteShops = [];
//   favoriteShops.forEach((favoriteShop) => {
//     newFavoriteShops = shopsToBeRemoved
//       .map((shopToBeRemoved) => {
//         return favoriteShop != shopToBeRemoved &&
//           favoriteShops.includes(shopToBeRemoved)
//           ? favoriteShop
//           : '';
//       })
//       .filter((shop) => shop);
//   });
//   await Favorite.findOneAndUpdate(
//     { user: req.query.userId },
//     { favoriteShops: newFavoriteShops },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).json({
//     status: 'success',
//     newFavoriteShops,
//   });
// });

//@desc Update favorite shops for user ==> By providing userid in query and array of favorite shops
//@route PATCH /api/v1/favorites/favorite
//access PUBLIC
exports.modifyFavoriteShops = catchAsync(async (req, res, next) => {
  let favorite = await Favorite.findOneAndUpdate(
    { user: req.query.userId },
    {
      favoriteShops: [...req.body.shopIds],
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    favorite,
  });
});
