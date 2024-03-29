var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    facebookId: String,
    email: String,
    gender: String,
    lookingFor: String,
    location: String,
    oneliner: String,
    description: String,
    age: Number,
    roles: []
});



User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);