const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy; 
const bcrypt = require('bcrypt');
const { userService } = require("../services/usersService")
let jwt = require('jsonwebtoken');
let config = require('./config');

passport.use( new LocalStrategy(
    { 
        usernameField: 'username', 
        passwordField: 'password',
    },
    (username, password, done) => { 

    userService.findUser(username,(error,data)=>{
        if (data.length==0 || error) {
            return done(null, false); 
        }
        if (bcrypt.compareSync(password, data[0].password)) { 
            let token = jwt.sign({
                username: data[0].email,
                role: data[0].role
            },
            config.secret, {
                expiresIn: '1h'
            });
            return done(null, {
                token:token,
                user:data[0]
            });
        } else {
            return done(null, false); 
        }
    }) 
}));

module.exports = passport;