import './style.css';
import './userprofile.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [follower, setFollower] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [date, setDate] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = window.location.pathname;
        const segments = path.split('/');
        const userId = segments[segments.length - 1];
        const response = await fetch(`/profile/${userId}`);
        const data = await response.json();    
        if (response.ok) {
          setFollower(data.user.followers);
          setCurrentUserId(data.currentUser._id);
          setUser(data.user._id);
          setUsername(data.user.username);
          const date = new Date(data.user.created);
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const result = month + ' ' + year;
          setDate(result);
          setFollowers(data.user.followers.length);
          setFollowing(data.user.following.length);
          setTweets(data.tweets);
          setLoading(false);
        } else {
          console.log(data.message);
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleFollow = async (event) => {
    event.preventDefault();
    const response = await fetch('/follow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  }; 

  const handleLogout = async () => {
    try {
      fetch('/logout');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };

  if (loading) {
    return (<div>loading...</div>)
  }
  
  return (
    <div className="feed-container">
    <div className="feed-search">
      <div className="feed-card1">
      <a class="twitter-timeline" data-lang="en" data-width="250" data-height="400" data-theme="light" href="https://twitter.com/Twitter?ref_src=twsrc%5Etfw">Tweets by Twitter</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
      <div className="feed-card2">
        <a class="twitter-timeline" data-lang="en" data-width="250" data-height="400" data-theme="light" href="https://twitter.com/NBA?ref_src=twsrc%5Etfw">Tweets by NBA</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
    </div>
    <div className="feed-navigation">
      <div className="feed-twitter-logo">
        <div className="feed-group">
          <img
            alt=""
            src="/images/image1.svg"
            className="feed-vector"
          />
        </div>
      </div>
      <div className="feed-home">
        <div className="feed-house">
          <div className="feed-group01">
            <img
              alt=""
              src="/images/image2.svg"
              className="feed-vector01"
            />
          </div>
        </div>
        <span>
        <Link className="feed-text02" to="/feed">Home</Link>
        </span>
      </div>
      <div className="feed-explore">
        <div className="feed-hashtag">
          <div className="feed-group02">
            <img
              alt=""
              src="/images/image3.svg"
              className="feed-vector02"
            />
          </div>
        </div>
        <span>
        <Link className="feed-text" to="/explore">Explore</Link>
        </span>
      </div>
      <div className="feed-notifications">
        <div className="feed-notification">
          <div className="feed-group03">
            <img
              alt=""
              src="/images/image4.svg"
              className="feed-vector03"
            />
          </div>
        </div>
        <span>
        <Link className="feed-text02" to="/notifications">Notifications</Link>
        </span>
      </div>
      <div className="feed-twitterblue">
        <div className="feed-twitterblue1">
          <div className="feed-group04">
            <img
              alt=""
              src="/images/image5.svg"
              className="feed-vector04"
            />
          </div>
        </div>
        <div><Link className="feed-text02" to="/twitterblue">Twitter Blue</Link></div>
      </div>
      <div className="feed-profile">
        <div className="feed-profile1">
          <div className="feed-group05">
            <img
              alt=""
              src="/images/image6.svg"
              className="feed-vector05"
            />
          </div>
        </div>
        <div><Link className="feed-text02" to="/profile">Profile</Link></div>
      </div>
      <div className="feed-settings">
        <div className="feed-setting">
          <div className="feed-group06">
            <img
              alt=""
              src="/images/image7.svg"
              className="feed-vector06"
            />
            <img
              alt=""
              src="/images/image6.svg"
              className="feed-vector07"
            />
          </div>
        </div>
        <span>
        <Link className="feed-text02" to="/settings">Settings</Link>
          <br></br>
        </span>
      </div>
      <button className="feed-main-logout-button" onClick={handleLogout}>
          <span className="feed-text04">
            <span>Logout</span>
          </span>
      </button>
    </div>
    <div className="feed-tweet">
      <div className="feed-box">
        <div className="profile-header">
          <img
            alt=""
            src="/header.png"
            width="600px"
          />
        </div>
        <div className="profile-image"></div>
        <div  style={{"display": "flex"}}>
            <div className="profile-username">{username}</div>
            <button className={(follower.includes(currentUserId)) ? "follow-button1" : "follow-button2"} onClick={handleFollow}>
                <span className="feed-text04">
                    <span>
                    {(follower.includes(currentUserId)) ? <span style={{"color": "grey"}}>Following</span> : <span>Follow</span>}
                    </span>
                </span>
            </button>
        </div>
        <div className="profile-date">Joined {date}</div>
        <div className="profile-connections">
          <div className="following">{followers} Followers</div>
          <div className="followers">{following} Following</div>
        </div>
        <div className="my-tweets" style={{opacity: tweets && tweets.length > 0 ? 100: 0}}>
          {tweets && tweets.length > 0 ? (
            [...tweets].reverse().map((tweet) => (
              <div className="my-tweet">
                <div className="tweet-header">
                  <div className="tweet-image"></div>
                  <div className="tweet-username">{username}</div>
                  <div className="tweet-date">
                  {new Date(tweet.created).toLocaleDateString('default', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="tweet-content">{tweet.tweet}</div>
              </div>
            ))
          ) : (
            <div className="my-tweet"></div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default UserProfile;