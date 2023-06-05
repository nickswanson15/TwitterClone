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
  origin: "https://localhost:3000", // change for deployment
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

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],

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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  }],
  parent: {
    type: Boolean,
    default: true,
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
      console.log(err)
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
// Define the search route
app.post('/search', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const query = req.body.query;
      const regex = new RegExp(query, 'i');
      const currentUser = req.user;
      const users = await User.find({ _id: { $ne: currentUser._id }, username: { $regex: regex }}).lean();
      const tweets = await Tweet.find({ user: { $ne: currentUser._id }, tweet: { $regex: regex }}).populate('user').lean();
      res.status(200).json({ users: users, tweets: tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error searching...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the follow user route
app.post('/follow', async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToFollow = await User.findById(req.body.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'user not found.' });
    }
    if (currentUser.following.includes(userToFollow.id)) {
      const currentUserIndex = currentUser.following.indexOf(userToFollow.id);
      const userToFollowIndex = userToFollow.followers.indexOf(currentUser.id);
      currentUser.following.splice(currentUserIndex, 1);
      userToFollow.followers.splice(userToFollowIndex, 1);
      await currentUser.save();
      await userToFollow.save();
      return res.status(200).json({ message: 'user unfollowed!' });
    }
    currentUser.following.push(userToFollow.id);
    userToFollow.followers.push(currentUser.id);
    await currentUser.save();
    await userToFollow.save();
    res.status(200).json({ message: 'user followed!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error following / unfollowing...' });
  }
});

// Define the like route
app.post('/like', async (req, res) => {
  try {
    const userId = req.user.id;
    const tweetId = req.body.tweetId;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'tweet not found.' });
    }
    if (tweet.likes.includes(userId)) {
      const userIndex = tweet.likes.indexOf(userId);
      tweet.likes.splice(userIndex, 1);
      await tweet.save();
      res.status(200).json({ message: 'unliked!' });
    } else {
      tweet.likes.push(userId);
      await tweet.save();
      res.status(200).json({ message: 'liked!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error liking...' });
  }
});

// Define the retweet route
app.post('/retweet', async (req, res) => {
  try {
    const userId = req.user.id;
    const tweetId = req.body.tweetId;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'tweet not found.' });
    }
    if (tweet.retweets.includes(userId)) {
      const userIndex = tweet.retweets.indexOf(userId);
      tweet.retweets.splice(userIndex, 1);
      await tweet.save();
      const currentUser = await User.findById(userId);
      if (currentUser.retweets.includes(tweetId)) {
        const tweetIndex = currentUser.retweets.indexOf(tweetId);
        currentUser.retweets.splice(tweetIndex, 1);
        await currentUser.save();
      }
      res.status(200).json({ message: 'unretweeted!' });
    } else {
      tweet.retweets.push(userId);
      await tweet.save();
      const currentUser = await User.findById(userId);
      if (!currentUser.retweets.includes(tweetId)) {
        currentUser.retweets.push(tweetId);
        await currentUser.save();
      }
      res.status(200).json({ message: 'retweeted!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error retweeting...' });
  }
});

// Define the reply route
app.post('/reply', async (req, res) => {
  try {
    const userId = req.user.id;
    const tweetId = req.body.tweetId;
    const replyText = req.body.replyText;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'tweet not found.' });
    }
    const newReply = new Tweet({
      tweet: replyText,
      user: userId,
      parent: false
    });
    await newReply.save();
    tweet.replies.push(newReply.id);
    await tweet.save();
    res.status(200).json({ message: 'replied!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error replying...' });
  }
});

// Define the delete tweet route
app.post('/delete-tweet', async (req, res) => {
  try {
    const deleteID = req.body.deleteID;
    const tweet = await Tweet.findOne({ _id: deleteID });
    for (const userId of tweet.likes) {
      await User.findByIdAndUpdate(userId, { $pull: { likes: deleteID } });
    }
    for (const userId of tweet.retweets) {
      await User.findByIdAndUpdate(userId, { $pull: { retweets: deleteID } });
    }
    for (const replyId of tweet.replies) {
      await Tweet.findOneAndDelete({ _id: replyId });
    }
    await Tweet.findOneAndDelete({ _id: deleteID });
    res.status(200).json({ message: 'deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error deleting tweet...' });
  }
});

// Define the update username route
app.post('/username', async (req, res) => {
  try {
      if (req.body.username1 != req.body.username2) {
        return res.status(301).json({ message: 'usernames do not match!' });
      }
      if (req.body.username1.length > 40) {
        return res.status(301).json({ message: 'username is too long!' });
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

// Define the update password route
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
    const username = req.body.username;
    const user = await User.findOne({ username });
    for (const followerId of user.followers) {
      const follower = await User.findById(followerId);
      const followerIndex = follower.following.indexOf(user._id);
      follower.following.splice(followerIndex, 1);
      await follower.save();
    }
    for (const followingId of user.following) {
      const following = await User.findById(followingId);
      const followingIndex = following.followers.indexOf(user._id);
      following.followers.splice(followingIndex, 1);
      await following.save();
    }
    const userReplies = await Tweet.find({ user: user._id });
    for (const tweet of userReplies) {
      for (const replyId of tweet.replies) {
        await Tweet.findOneAndDelete({ _id: replyId });
      }
    }
    const userTweets = await Tweet.find({ user: user._id });
    for (const tweet of userTweets) {
      await Tweet.updateMany(
        { _id: tweet._id },
        { $pull: { retweets: user._id } }
      );
    }
    await Tweet.deleteMany({ user: user._id });
    await User.findOneAndDelete({ username });
    res.status(200).json({ message: 'deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error deleting account...' });
  }
});

// Define the feed (view) route
app.get('/feed', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const currentUser = await User.findById(req.user.id).populate('following', 'username');
      const followingUserIds = currentUser.following.map(user => user.id);
      const tweets = await Tweet.find({ $or: [{ user: { $in: followingUserIds }, parent:true }, { user: currentUser._id, parent: true }, { _id: { $in: currentUser.retweets } }, { retweets: { $in: followingUserIds } }] }).populate('user');
      res.status(200).json({ user: req.user, tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error loading feed...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the profile route
app.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      const tweets = await Tweet.find({
        $or: [
          { $and: [{ user: userId, parent: true }] },
          { $and: [{ _id: { $in: user.retweets } }] },
        ],
      }).populate('user');
      res.status(200).json({ user: req.user, tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving profile data...' });
  
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the explore route
app.get('/explore', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const currentUser = req.user;
      const users = await User.find({ _id: { $ne: currentUser._id } }).limit(20);
      const tweets = await Tweet.find({ user: { $ne: currentUser._id }, parent: true }).populate('user').limit(20);
      res.status(200).json({ user: currentUser, users, tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving explore data...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the notifications route
app.get('/notifications', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      const tweets = await Tweet.find({ user: userId, parent: true })
        .populate({ path: 'user', select: 'username' })
        .populate({ path: 'likes', select: 'username' })
        .populate({ path: 'retweets', select: 'username' })
        .populate({ path: 'replies', populate: { path: 'user', select: 'username' } });
      res.status(200).json({ user: user, tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving notifications data...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the user profile route
app.get('/profile/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const currentUser = req.user;
      const userId = (req.params.id);
      const user = await User.findById(userId);
      const tweets = await Tweet.find({ $or: [{ user: userId, parent: true }, { _id: { $in: user.retweets }}]}).populate('user');
      res.status(200).json({ currentUser: currentUser, user: user, tweets });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving profile data...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the user connections route
app.get('/connections/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = (req.params.id);
      const user = await User.findById(userId);
      const followers = await User.find({ _id: { $in: user.followers } });
      const following = await User.find({ _id: { $in: user.following } });
      res.status(200).json({ user: user, followers, following });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving connections data...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the tweet (view) route
app.get('/tweet/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
      const tweetId = (req.params.id);
      const tweet = await Tweet.find({ _id: tweetId }).populate('user').populate({ path: 'replies', populate: { path: 'user', select: 'username' } });
      res.status(200).json({ user: user, tweet: tweet[0] });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'error retrieving profile data...' });
    }
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
});

// Define the logout route
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'logged out' });
  });
});

// Stripe payment processing for Twitter Blue
const endpointSecret = '';
const stripe = require('stripe')(process.env.STRIPE);
app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1NEp57GjCmRHchXXijtJpL08',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/webhook`, // change for deployment
    cancel_url: `http://localhost:3000/twitterblue`, // change for deployment
    automatic_tax: {enabled: true},
  });

  res.status(200).json({ message: session.url });
});

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;
  if (endpointSecret) {
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
  response.send();
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));