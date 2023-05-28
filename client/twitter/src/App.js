import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Signup from './components/signup';
import Login from './components/login';
import Feed from './components/feed';
import Explore from './components/explore';
import Notifications from './components/notifications';
import TwitterBlue from './components/twitterblue';
import Settings from './components/settings';
import Profile from './components/profile';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/twitterblue" element={<TwitterBlue />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


