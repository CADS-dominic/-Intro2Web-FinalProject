const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Users = require('../model/user')


module.exports = function(passport) {
    passport.use( 
        new LocalStrategy({usernameField: 'email'}, (email, passport, done)=> {
            Users.findOne({email: email})
                .then(user => {
                    if(!user) {
                        return done(null, false, {message: 'This email is not registered'})
                    }
                    if(user.ban) {
                        return done(null, false, {message: 'This account is banned'})
                    }
                    bcrypt.compare(passport, user.password, (err, isMatch) => {
                        if(err) throw err

                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {message: 'Invalid Password'})
                        }
                    })  
                })
                .catch(err => console.log(err));
        })

        
    )
    passport.use(new FacebookStrategy({
        clientID: "1134705303953172",
        clientSecret: "ce132e835a87e89876174c35bd6d492e",
        callbackURL: "https://sneaker-jeeps-customer.herokuapp.com/auth/facebook/callback",
        profileFields   : ['id','displayName','email']
      },
      function(accessToken, refreshToken, profile, cb) {
        Users.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
            if (err)
                return cb(err);
 
            if (user) {
                return cb(null, user);
            } else {
                var newUser = new Users({});


                newUser.role = 'user'
                newUser.name = profile.displayName
                newUser.email = profile.emails[0].value
                newUser.password = profile.id
                // const newUser = new Users({profile.displayName, email, password, role});
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return cb(null, newUser);
                });
            }
 
        });
      }
    ));




    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        });
    });

}