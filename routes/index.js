const allRoutes = require('express').Router();

allRoutes.use('/signup', require('./signup'));
allRoutes.use('/signin', require('./signin'));
allRoutes.use('/forgot-password', require('./forgotPassword'));

module.exports = allRoutes;