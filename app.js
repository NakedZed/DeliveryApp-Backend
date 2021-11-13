const express = require('express');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const shopRouter = require('./routes/shopRouter');
const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');
const AppError = require('./utils/appError');

const app = express();
app.use(express.urlencoded({ extended: true }));
//core middlewares
app.use(express.json());

const globalErrorHandler = require('./controllers/errorController');

//Implement cors and compression
app.use(cors());
app.use(compression());

app.options('*', cors());
app.use('/api/v1/users', userRouter); //Request will hit this first and then match with one of userRouters.
app.use('/api/v1/shops', shopRouter); //Request will hit this first and then match with one of shopRouters.
app.use('/api/v1/categories', categoryRouter); //Request will hit this first and then match with one of categoryRouters.
app.use('/api/v1/products', productRouter); //Request will hit this first and then match with one of productRouters.

//If there is no matching route this middleware will be FIRED!
app.all('*', (req, res, next) => {
  /*if next took an argument -> express will detect that there is an error and will skip all the middlewares 
    and goes to the GLOBAL ERROR HANDLER*/
  next(new AppError(`Cant find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
