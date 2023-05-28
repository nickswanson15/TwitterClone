const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express();

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://localhost:3000",
  credentials: true,
}));
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(cookieParser('secret'))
app.use(passport.initialize());
app.use(passport.session());
dotenv.config({ path: './config/config.env' })

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  created: {
    type: Date,
    default: Date.now
  }});

// Define the tweet schema
const tweetSchema = new mongoose.Schema({
  tweet: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }});

// Define the user model
const User = mongoose.model('User', userSchema);

// Define the tweet model
const Tweet = mongoose.model('Tweet', tweetSchema);

// Define the local strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
        .then(user => {
            if(!user) {
                return done(null, false);
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if (isMatch) {
                    return done(null,  user);
                } else {
                    return done(null,  false);
                }
            });
        })
        .catch(err => console.log(err));
}));

// Define the serialization and deserialization methods for passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

// Define the signup route
app.post('/signup', async (req, res) => {
  try {
      if (req.body.password1 != req.body.password2) {
        return res.status(301).json({ message: 'passwords do not match!' });
      }
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(301).json({ message: 'username already exists!' });
      }
      const hashed = await bcrypt.hash(req.body.password1, 10);
      const newUser = new User({
          username: req.body.username,
          password: hashed
      });
      await newUser.save();
      res.status(200).json({ message: 'account created!' });
  } catch (err) {
      res.status(500).json({ message: 'error signing up...' });
  }
});

// Define the login route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(301).json({ message: 'username or password incorrect!' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'logged in!' });
    });
  })(req, res, next);
});

// Define the feed (tweet) route
app.post('/feed', async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      const newTweet = new Tweet({
          tweet: req.body.tweet,
          user: user.id
      });
      await newTweet.save();
      res.status(200).json({ message: 'tweeted!' });
  } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'error tweeting...' });
  }
});
// Define the delete tweet route
app.post('/delete-tweet', async (req, res) => {
  try {
      await Tweet.findOneAndDelete({ _id: req.body.deleteID });
      res.status(200).json({ message: 'deleted!' });
  } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'error deleting...' });
  }
});

// Define the username route
app.post('/username', async (req, res) => {
  try {
      if (req.body.username1 != req.body.username2) {
        return res.status(301).json({ message: 'usernames do not match!' });
      }
      const existingUser = await User.findOne({ username: req.body.username1 });
      if (existingUser) {
        return res.status(301).json({ message: 'username already exists!' });
      }
      const user = await User.findOne({ username: req.body.username });
      user.username = req.body.username1;
      await user.save();
      res.status(200).json({ message: 'username changed!' });
  } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'error changing username...' });
  }
});

// Define the password route
app.post('/password', async (req, res) => {
  try {
      if (req.body.password1 != req.body.password2) {
        return res.status(301).json({ message: 'passwords do not match!' });
      }
      const user = await User.findOne({ username: req.body.username });
      const hashed = await bcrypt.hash(req.body.password1, 10);
      user.password = hashed;
      await user.save();
      res.status(200).json({ message: 'password changed!' });
  } catch (err) {
    console.log(err)
      res.status(500).json({ message: 'error changing password...' });
  }
});

// Define the delete account route
app.post('/delete-account', async (req, res) => {
  try {
      await User.findOneAndDelete({ username: req.body.username });
      res.status(200).json({ message: 'deleted!' });
  } catch (err) {
    console.log(err)
      res.status(500).json({ message: 'error deleting...' });
  }
});

// Define the feed route
app.get('/feed', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    console.log("unauthorized");
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the profile route
app.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const tweets = await Tweet.find({ user: req.user.id }).lean()
      res.status(200).json({ user: req.user, tweets });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'error retrieving profile data' });
  
    }
  } else {
    console.log("unauthorized");
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the logout route
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    console.log("logged out")
    res.status(200).json({ message: 'logged out' });
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));