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
const Axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

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

  
// ...

// Routes

auth(app, User);  // authentication

app.get('/', (req, res) => {
  res.send("hello world");
})

app.post('/api/get-code', (req, res) => {
  const phone = req.body.phone;
  const code = {
    value: OTP(6)
  }
  console.log(code)
  User.findOne({phone}).then((foundUser) => {
    if (foundUser) {
      const upRes = User.findOneAndUpdate({phone}, {notifications: `votre code est le suivant: ${code}`})
      res.send(code)
    }
  })
})

app.post('/api/profile', async (req, res) => {
  const foundUser = await User.findById(req.body.user)
  res.send(foundUser)
})

app.post('/api/verify-code', async (req, res) => {
  const code = req.body.code;

  try {
    const foundCode = await Code.findOne({ code });

    if (foundCode) {
      const delRes = await Code.deleteOne({code});
      console.log(delRes)
      res.send('ok');
    } else {
      res.status(401).send('code incorrecte');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/create-checkout-session', async (req, res) => {

  const url = 'https://api.notchpay.co/payments/initialize';
  const fields = {
    email: 'sakpakd@gmail.com',
    amount: '1000',
    currency: 'XAF',
    description: 'Payment description', // this field is optional
    reference: 'your_unique_reference', // this param is optional but recommended
  };
  
  const result =  await Axios.post(url, fields, {
    Headers: {
      "Authorization": "sb.3CThbWdTYo2pcJkSQmcysgAVlYuWrYjZD6sebIFF3j8gAl6clK0RvCl0iQUtowGqXeL8lr5Pf9rpstLJZ3xyp8SdK9SdkPADUUYTKsp0xaZBrbkDvZ6lFs4Hv5Su6",
      "Cache-Control": "no-cache"
    }
  })

  // console.log(result)
  res.send(result)
})

app.post('/api/verify-agent', async (req, res) => {
  const matricule = req.body.matricule;

  try {
    const foundAgent = await Agent.findOne({ matricule });

    if (foundAgent) {
      res.send('ok');
    } else {
      res.status(401).send('matricule incorrecte');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/notify-client', async (req, res) => {
  const phone = req.body.phone;

  try {
    const foundUser = await User.findOne({ phone });

    if (foundUser) {
      const upRes = await User.updateOne({ phone }, {notifications: 'nouveau colis'});
      console.log(upRes)
      res.send('ok');
    } else {
      res.status(400).send('Aucun utilisaterur ne pocede ce numero');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
