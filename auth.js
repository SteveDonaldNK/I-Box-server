const bcrypt = require('bcrypt');
const passport = require('passport');

async function handleAuth(app, User) {
  app.post("/api/register", async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });
      if (foundUser) {
        res.status(403).send("L'email est déjà associé à un compte");
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: hashedPassword,
        });
        await newUser.save();
        res.status(200).send("OK");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Une erreur s'est produite lors de l'inscription");
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Une erreur s'est produite lors de la connexion");
      }
      if (!user) {
        return res.status(401).send("Nom d'utilisateur ou mot de passe incorrect");
      }
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Une erreur s'est produite lors de la connexion");
        }
        const session = {
          sessionID: req.sessionID,
          session: req.session,
        };
        res.send(session);
      });
    })(req, res, next);
  });
}

module.exports = handleAuth;
