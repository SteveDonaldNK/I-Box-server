require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./auth');
const OTP = require('./OTP');
const init = require('./init');
const User = require('./Schema/user');
const Code = require('./Schema/code');
const Agent = require('./Schema/agent');
const localStategy = require('./strategy');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
const port = 3000;

// Initialization
init(mongoose);

// Middleware
app.use(express.json());
app.use(session({ //initialize session
// store: new RedisStore({client: redisClient}),
secret: 'mysecret',
resave: false,
saveUninitialized: false,
cookie: {
    maxAge: 1000*60*60*24*7,
    secure: false, // set to true in production i.e only transmit cookie over https
    httpOnly: true, // prevents client side JS from reading the cookie
  }
}));
localStategy(User);

app.use(cookieParser());
app.use(passport.initialize()); //set up passport for authentication
app.use(passport.session()); //use passport setup session

passport.serializeUser(function(user, done) { //create cookie
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

  
// Routes

auth(app, User);  // authentication

app.get('/', (req, res) => {
  res.send("hello world");
})

app.get('/api/set-code', (req, res) => {
  
});

app.post('/api/verify-code', async (req, res) => {
  const code = req.body.code;

  await Code.findOne({code}).then((code) => {
    if (code) { res.send('ok') } else { res.send('code incorrecte') }
  }).catch(err => console.log(err));
})

app.post('/api/verify-agent', async (req, res) => {
  const matricule = req.body.matricule;

  await Agent.findOne({matricule}).then((agent) => {
    if (agent) { res.send('ok') } else { res.send('matricule incorrecte') }
  }).catch(err => console.log(err));
})

// app.post('/api/notify-user', async (req, res) => {
//   const phone = req.body.phone;

//   await User.findOne({phone}).then((user) => {
    
//   }).catch(err => console.log(err));
// })

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
