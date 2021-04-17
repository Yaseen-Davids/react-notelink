const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcryptjs");

const {
  GetUserByUsername,
  GetUserById,
  GetUserByToken,
  GetUserByEmail,
  CreateUser,
} = require("../repositories/user");

const generateUsername = (name) => {
  let str = name.split(" ").join("");
  str = str + Math.floor(Math.random() * 1000 + 100);
  return str;
};

module.exports = (passport) => {
  passport.use(
    "token",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await GetUserByToken(password);

        if (!user) {
          throw "User does not exist";
        }

        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error });
      }
    })
  );

  passport.use(
    "local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await GetUserByUsername(username);

        if (!user) {
          throw "User does not exist";
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect Username or Password",
            });
          }
        });
      } catch (error) {
        return done(null, false, { message: error });
      }
    })
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/users/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;

        let user = await GetUserByEmail(email);

        if (!user) {
          const person = {
            username: generateUsername(name),
            email: email,
            password: accessToken,
          };
          const resp = await CreateUser(person);
          user = resp[0];
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await GetUserById(id);
    if (user) {
      done(null, user);
    }
  });
};
