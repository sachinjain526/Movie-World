var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
const configAuth = require('../config/keys');
const User = require('../mongoDb/users');
const collection = require('../config/collection');

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
},
    function (accesstoken, refreshToken, profile, done) {
        process.nextTick(function () {
            const newUser = {
                _id: profile.id,
                accesstoken: accesstoken,
                displayName: profile.displayName
            }
            const dataToSave = { ...newUser, registeredDate: new Date(), userCollection: collection }
            User.findOrCreate(profile.id, dataToSave, function (err, user) {
                if (err) {
                    return done(err);
                }
                done(null, newUser);
            });
        });
    }
));

module.exports = passport;