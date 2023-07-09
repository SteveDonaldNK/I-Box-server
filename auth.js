const bcrypt = require('bcrypt');
const passport = require('passport');

function handleAuth(app, User) {
  app.post("/api/register", async(req, res) => {
    await User.findOne({email: req.body.email})
    .then(async(foundUser) => {
      if(foundUser) {
        res.status(403).send("l'email est déjà associé à un compte")
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
            username: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        })
        newUser.save();
        res.status(200).send("ok");
      }
    }).catch(err => console.log(err))
  })
  
  app.post('/api/login',
    passport.authenticate("local"),
    function(req, res) {
      const session = {
        sessionID: req.sessionID,
        session: req.session,
      }
      res.send(session);
    }
  );
}

module.exports = handleAuth;