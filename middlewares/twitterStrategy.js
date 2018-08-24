var passport = require('passport')
    , FacebookStrategy = require('passport-twitter').Strategy;
const configAuth = require('../config/keys');
const User = require('../mongoDb/users');

passport.use(new FacebookStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            const newUser = {
                _id: profile.id,
                accesstoken: accessToken,
                displayName: profile.displayName,
                email: profile.emails[0].value, // pull the first email
                photoUrl: profile.photos[0].value // pull the first email
            }
            console.log(newUser);
            User.findOrCreate({ _id: profile.id }, newUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                done(null, user);
            });
        });
    }
));

module.exports = passport;