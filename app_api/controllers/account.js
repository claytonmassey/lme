var mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');
var User = require('../models/account.js');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var config = require('../../config');
var utils = require('../utils');
var request = require('request');

var returnObj = {};
var jwtSecret = config.jwtSecret;

// configure passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


returnObj.login = function(req, res, next){

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if (!user) {
            return res.status(401).json({err: info});
        }
        else {
            var token = jwt.sign({userid: user.id}, jwtSecret, { expiresIn: 60*60 });
            res.status(200).json({token: token});
        }

    })(req, res, next);

};

returnObj.register = function(req, res) {

    var newUser = new User({
        username : req.body.email,
        email: req.body.email,
        gender: req.body.gender,
        lookingFor: req.body.lookingFor
    });

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            utils.sendJsonResponse(res, 500, {
                "error" : err.message
            });
        }
        else {
            //TODO: Setup email verification

            var token = jwt.sign({userid: user.id}, jwtSecret, { expiresIn: 60*60 });
            utils.sendJsonResponse(res, 200, {
                token: token
            });
        }

    });


};

returnObj.facebookLoginCallback = function(req, res){

    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture.type(large)'];
    var accessTokenUrl = config.facebookLogin.facebookTokenUrl;
    var graphApiUrl = config.facebookLogin.facebookGraphApiUrl + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.facebookLogin.facebookClientSecret,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({ message: accessToken.error.message });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: profile.error.message });
            }
            console.log(profile);

            var formData = {
                profileId: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email
            };

            findOrCreateFBUser(res, profile.id, profile.first_name, profile.last_name, profile.email);

        });
    });


};



function findOrCreateFBUser(res, fbProfileId, fbFirstName, fbLastName, fbEmail) {

    User.findOne({'facebookId': fbProfileId  },
        function(err, user) {
            if (err) {
                return console.log(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    username : fbEmail,
                    firstname : fbFirstName,
                    lastname : fbLastName,
                    email: fbEmail,
                    facebookId: fbProfileId

                });
                user.save(function(err) {
                    if (err) console.log(err);

                    var token = jwt.sign({userid: user.id}, jwtSecret, { expiresIn: 60*60 });
                    utils.sendJsonResponse(res, 200, {
                        token: token
                    });
                });
            } else {
                //found user. Return
                var token = jwt.sign({userid: user.id}, jwtSecret, { expiresIn: 60*60 });
                utils.sendJsonResponse(res, 200, {
                    token: token
                });
            }
        });
};



module.exports = returnObj;


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};