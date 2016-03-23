var config = {};
devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');
config.devBuild = devBuild;

config.mongodb_connection_string = 'mongodb://dbuser1:lavishme2016@ds021299.mlab.com:21299/lavishme';
config.jwtSecret = 'secret_lavish_me_2016!';

config.facebookLogin = {
    facebookClientSecret : 'b50388ccf0a122cbffb26eaf5cad81f7',
    facebookTokenUrl : 'https://graph.facebook.com/v2.5/oauth/access_token',
    facebookGraphApiUrl : 'https://graph.facebook.com/v2.5/me?fields='
};

if(devBuild){
    config.apiUrl = 'http://localhost:3000/api/';
}
else {
    config.apiUrl = 'http://localhost:3000/api/';
}


module.exports = config;