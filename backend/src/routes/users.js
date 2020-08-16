const express = require('express');

const userController = require('../controllers/user');
// const checkJwt = require('../middlewares/checkJwt');

let router = express.Router();

router
    .route('/create')
    .post(userController.create);

router
    .route('/login')
    .post(userController.login);

module.exports = router;