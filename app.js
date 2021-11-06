const express = require('express');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routes/userRouter');

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

//If there is no matching route this middleware will be FIRED!
app.all('*', (req, res, next) => {
  /*if next took an argument -> express will detect that there is an error and will skip all the middlewares 
    and goes to the GLOBAL ERROR HANDLER*/
  next(new AppError(`Cant find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
