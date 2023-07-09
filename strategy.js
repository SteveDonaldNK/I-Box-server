const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require("passport-local")

module.exports = function localStrategy (User) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
    },
    async (email, password, done) => {
        await User.findOne({email: email}).then(async(foundUser) => {
            if (foundUser === null) { return done(null, false) }

            try {
                if (await bcrypt.compare(password, foundUser.password)) {
                    return done(null, foundUser);
                } else {
                    return done(null, false)
                }
            } catch (error) {
                return done(null, false)
            }
        }).catch(err => {
            return done(err)
        })
    })
)}