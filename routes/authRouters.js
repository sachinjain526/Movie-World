
var GoogleStrategy = require('../middlewares/googleStrategy');
var FacebookStrategy = require('../middlewares/facebookStrategy');
var TwitterStrategy = require('../middlewares/twitterStrategy');

module.exports = (app) => {

    app.get('/', isLoggedIn, function (req, res, next) {
        res.render('user', { user: req.user });
    });

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    /* FACEBOOK ROUTER */
    app.get('/auth/facebook',
        FacebookStrategy.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        FacebookStrategy.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    /* TWITTER ROUTER */
    app.get('/auth/twitter',
        TwitterStrategy.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        TwitterStrategy.authenticate('twitter', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    /* GOOGLE ROUTER */
    app.get('/auth/google',
        GoogleStrategy.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        GoogleStrategy.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
}