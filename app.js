const express = require('express');
const compression = require('compression');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));

//Implement cors
app.use(cors());
app.use(compression());

app.options('*', cors());
module.exports = app;
