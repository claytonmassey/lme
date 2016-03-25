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

returnObj.saveProfile = function (req, res) {

    //get userid from authentication token
    var userId = req.body._id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var oneliner = req.body.oneliner;
    var description = req.body.description;
    var gender = req.body.gender;
    var lookingFor = req.body.lookingFor;
    var age = req.body.age;


    User.findById(userId, function (err, userInfo) {
        if (err) {
            utils.sendJsonResponse(res, 500, {
                "error" : err
            });
        }
        else {
            userInfo.firstname = firstname;
            userInfo.lastname = lastname;
            userInfo.email = email;
            userInfo.oneliner = oneliner;
            userInfo.description = description;
            userInfo.gender = gender;
            userInfo.lookingFor = lookingFor;
            userInfo.age = age;

            userInfo.save(function (err, userInfo) {
                if (err) {
                    utils.sendJsonResponse(res, 500, {
                        "error": err
                    });
                }
                else {
                    utils.sendJsonResponse(res, 200, {
                        "user": userInfo
                    });
                }
            });
        }

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

