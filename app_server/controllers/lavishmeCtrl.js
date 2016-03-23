var config = require('../../config.js');
var request = require('request');

module.exports.lavishMeApp = function(req, res){
    res.render('index');
};


module.exports.facebookLoginCallback = function(req, res, next){

    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
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

            request.post({url: config.apiUrl + 'facebookUser', form: formData, json:true}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    res.send({ token: '' });
                }
                res.send({ token: body.token });
            });


        });
    });


};


