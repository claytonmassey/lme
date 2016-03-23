var mongoose = require('mongoose');
var User = require('../models/account.js');
var utils = require('../utils');
var moment = require('moment');

var returnObj = {};

returnObj.myProfile = function (req, res) {

    //get userid from authentication token
    var userId = req.userinfo.userid;

    User.findById(userId, function (err, userInfo) {
        if (err) return next(err);

        utils.sendJsonResponse(res, 200, {
            "status" : "success",
            "user": userInfo
        });
    });

};

returnObj.profileById = function (req, res) {

    var userId = req.params.userid;

    User.findById(userId, function (err, userInfo) {
        if (err) return next(err);

        utils.sendJsonResponse(res, 200, {
            "status" : "success",
            "user": userInfo
        });
    });

};

module.exports = returnObj;

