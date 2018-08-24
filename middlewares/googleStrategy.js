const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const configAuth = require('../config/keys');
const User = require('../mongoDb/users');
const collection = require('../config/collection');

passport.use(new GoogleStrategy({

    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,

},
    function (accesstoken, refreshToken, profile, done) {
        process.nextTick(function () {
            const newUser = {
                _id: profile.id,
                accesstoken: accesstoken,
                displayName: profile.displayName,
                email: profile.emails[0].value, // pull the first email
                photoUrl: profile.photos[0].value,// pull the first email

            }
            const dataToSave = { ...newUser, registeredDate: new Date(), userCollection: collection }
            console.log(newUser);
            User.findOrCreate(profile.id, dataToSave, function (err, user) {
                if (err) {
                    return done(err);
                }
                done(null, newUser);
            });
        });
    })
)
module.exports = passport;