const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require('passport'),
  cookieSession = require('cookie-session'); // to manage cookie and session for express server
const Mongoose = require('mongoose');
const intializeDatabase = require("./mongoDb/connection");
const authRoutes = require("./routes/authRouters");
const apiRoutes = require("./routes/apiRouters");
//const jwtMiddleWare = require('./middlewares/jwtMiddleware');
const keys = require('./config/keys');
// Create global app object
const app = express();
const router = express.Router();
// middle ware start 
app.use('/api', router);
// middle ware start 
app.use(cookieSession({
  name: 'session',
  keys: [keys.sessionKey],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('dist'));// it will prefer the directory to serve the file

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// for sesion
app.use(passport.initialize());
app.use(passport.session());
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (user, done) {
  done(null, user);
});
// finally, let's start our server...
app.set('jwtSecret', keys.jwtSecret);

//app.use(jwtMiddleWare());

intializeDatabase(Mongoose, function () {
  app.listen(process.env.PORT || 3000, function () {
    authRoutes(app);
    apiRoutes(app);
    console.log("server is running on port 3000");
  })
});

