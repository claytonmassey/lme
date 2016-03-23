var express = require('express');
var router = express.Router();
var ctrlAccount = require('../controllers/account');
var ctrlProfile = require('../controllers/profile');
var expressjwt = require('express-jwt');
var config = require('../../config');

var jwtSecret = config.jwtSecret;

var auth = expressjwt({
    secret: jwtSecret,
    userProperty: 'userinfo'
});

//authentication
router.post('/account/register', ctrlAccount.register);
router.post('/account/login', ctrlAccount.login);
router.post('/account/facebookcallback', ctrlAccount.facebookLoginCallback);



//profile routes
router.get('/profile', auth, ctrlProfile.myProfile);
router.get('/profile/:userid', auth, ctrlProfile.profileById);

module.exports = router;