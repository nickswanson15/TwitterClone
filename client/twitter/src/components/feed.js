/*
TODO:

double click

main:
main feed tweets (only from following) and like / reply / retweet / delete, 
follow user by clicking button, which stores that users id (the user you want to follow) in your array of following,
loop through your array of following (which is an array of ids) and for each id (find tweet by id), collect all tweets,
then sort by created.

Search / Explore (display all tweets) (on search submit in feed... take to explore page (same functionality for search bar in feed and search bar in explore page))

Notifications (likes, replies, retweets)
Twitter Blue (stripe)

Route Protection (where necessary)
*/

import './style.css';
import './feed.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [tweet, setTweet] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/feed');
        const data = await response.json();
        if (response.ok) {
          setUsername(data.user.username);
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

  const toggle = async (event) => {
    setTweet('');
    const popup = document.querySelector('.popup');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: tweet, username: username})
    });
    const data = await response.json();
    console.log(data)
    window.location.reload();
  };  

  const isTweetEmpty = tweet === '';

  if (loading) {
    return (<div>loading...</div>)
  }
  
  return (
    <div className="feed-container">
      <div className="feed-search">
        <div className="feed-search-bar">
          <svg viewBox="0 0 1024 1024" className="feed-icon">
            <path d="M406 598q80 0 136-56t56-136-56-136-136-56-136 56-56 136 56 136 136 56zM662 598l212 212-64 64-212-212v-34l-12-12q-76 66-180 66-116 0-197-80t-81-196 81-197 197-81 196 81 80 197q0 42-20 95t-46 85l12 12h34z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Twitter"
            className="feed-textinput input"
          />
        </div>
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
          <Link className="feed-text" to="/feed">Home</Link>
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
        <button className="feed-main-tweet-button" onClick={toggle}>
          <span className="feed-text04">
            <span>Tweet</span>
          </span>
        </button>
      </div>
      <div className="feed-tweet">
        <div className="feed-tweet-text">
          <input
            id = "tweetinput1"
            type="text"
            placeholder="What's Happening..."
            className="feed-textinput1 input"
            onChange={e => setTweet(e.target.value)}
          />
        </div>
        <div className="feed-icon-container">
          <div className="feed-icons">
            <div className="feed-image">
              <div className="feed-group07">
                <img
                  alt=""
                  src="/images/image8.svg"
                  className="feed-vector08"
                />
                <img
                  alt=""
                  src="/images/image9.svg"
                  className="feed-vector09"
                />
              </div>
            </div>
            <div className="feed-gif">
              <div className="feed-group08">
                <img
                  alt=""
                  src="/images/image10.svg"
                  className="feed-vector10"
                />
                <img
                  alt=""
                  src="/images/image11.svg"
                  className="feed-vector11"
                />
              </div>
            </div>
            <div className="feed-stats">
              <div className="feed-group09">
                <img
                  alt=""
                  src="/images/image12.svg"
                  className="feed-vector12"
                />
              </div>
            </div>
            <div className="feed-smiley">
              <div className="feed-group10">
                <img
                  alt=""
                  src="/images/image13.svg"
                  className="feed-vector13"
                />
                <img
                  alt=""
                  src="/images/image14.svg"
                  className="feed-vector14"
                />
                <img
                  alt=""
                  src="/images/image15.svg"
                  className="feed-vector15"
                />
                <img
                  alt=""
                  src="/images/image16.svg"
                  className="feed-vector16"
                />
              </div>
            </div>
          </div>
        </div>
        <button className="feed-tweet-button" onClick={handleSubmit} disabled={isTweetEmpty}>
          <span className="feed-text04">
            <span>Tweet</span>
          </span>
        </button>
      </div>
      <div class="popup">
        <div class="popup-content">
          <form>
            <textarea id="tweet-text" name="tweet" placeholder="What's happening..." onChange={e => setTweet(e.target.value)}></textarea>
            <div class="popup-buttons">
              <button class="popup-button" type="button" onClick={toggle}>Cancel</button>
              <button class="popup-button" type="button" onClick={handleSubmit} disabled={isTweetEmpty}>Tweet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feed;