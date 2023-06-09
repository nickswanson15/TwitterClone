import './style.css';
import './notifications.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/notifications');
        const data = await response.json();
        if (response.ok) {
          console.log(data)
          setUser(data.user._id);
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
        <Link className="feed-text02" to="/explore">Explore</Link>
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
        <Link className="feed-text" to="/notifications">Notifications</Link>
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
    <div className="feed-tweet2">
      <div id="title">Notifications</div>
      <div className="select"><span></span><span></span></div>
      <div className="feed-box2">
        <div className="my-tweets">
          {tweets && tweets.length > 0 ? (
            [...tweets].reverse().map((tweet) => (
              <div>
                {tweet.likes.length > 0 ? (
                  [...tweet.likes].reverse().map((like) =>
                  <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/tweet/${tweet._id}`} key={tweet._id}>
                    <div style={{"padding": "20px"}} className="my-tweet">
                      <div className="tweet-header">
                        {like.username} liked your tweet!
                      </div>
                    </div>
                  </Link>
                  )
                ) : (
                  <span></span>
                )}
                {tweet.retweets.length > 0 ? (
                  [...tweet.retweets].reverse().map((retweet) =>
                  <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/tweet/${tweet._id}`} key={tweet._id}>
                    <div style={{"padding": "20px"}} className="my-tweet">
                      <div className="tweet-header">
                        {retweet.username} retweeted your tweet!
                      </div>
                    </div>
                  </Link>
                  )
                ) : (
                  <span></span>
                )}
                {tweet.replies.length > 0 ? (
                  [...tweet.replies].reverse().map((reply) =>
                  <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/tweet/${tweet._id}`} key={tweet._id}>
                    <div style={{"padding": "20px"}} className="my-tweet">
                      <div className="tweet-header">
                        {reply.user.username} replied to your tweet!
                      </div>
                    </div>
                  </Link>
                  )
                ) : (
                  <span></span>
                )}
              </div>
            ))
          ) : (
            <div className="my-tweet" style={{"padding-left": "230px", "padding-bottom": "20px"}}>no notifications...</div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default Notifications;