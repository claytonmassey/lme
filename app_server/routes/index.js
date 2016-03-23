var express = require('express');
var router = express.Router();
var ctrlLavishMe = require('../controllers/lavishmeCtrl');

/* GET home page. */
router.get('/', ctrlLavishMe.lavishMeApp);

//Facebook Login page
router.post('/facebookcallback', ctrlLavishMe.facebookLoginCallback);



module.exports = router;
