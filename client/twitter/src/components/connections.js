import './style.css';
import './connections.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Connections() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [select, setSelect] = useState(true);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = window.location.pathname;
        const segments = path.split('/');
        const userId = segments[segments.length - 1];
        const response = await fetch(`/connections/${userId}`);
        const data = await response.json();   
        if (response.ok) {
          setUser(data.user._id);
          setFollowers(data.followers);
          setFollowing(data.following);
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
    <div className="feed-tweet2">
      <div className="select"><span onClick={() => setSelect(true)} id={select ? "select1" : "select2"}>followers</span><span onClick={() => setSelect(false)} id={select ? "select2" : "select1"}>following</span></div>
      <div className="feed-box2">
      <div className="my-tweets" style={{ display: (select) ? "" : "none" }}>
        {followers && followers.length > 0 ? (
            [...followers].map((follower) => (
              <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/profile/${follower._id}`} key={follower._id}>
              <div className="my-tweet">
                <div className="tweet-header">
                  <div className="tweet-image"></div>
                  <div className="tweet-username">{follower.username}</div>
                </div>
                <div className="tweet-content"></div>
              </div>
              </Link>
            ))
          ) : (
            <div className="my-tweet" style={{"padding-left": "230px", "padding-bottom": "20px"}}>no users found...</div>
          )}
        </div>
        <div className="my-tweets" style={{ display: (select) ? "none" : "" }}>
          {following && following.length > 0 ? (
            [...following].map((followee) => (
              <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/profile/${followee._id}`} key={followee._id}>
              <div className="my-tweet">
                <div className="tweet-header">
                  <div className="tweet-image"></div>
                  <div className="tweet-username">{followee.username}</div>
                </div>
                <div className="tweet-content"></div>
              </div>
              </Link>
            ))
          ) : (
            <div className="my-tweet" style={{"padding-left": "230px", "padding-bottom": "20px"}}>no users found...</div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default Connections;