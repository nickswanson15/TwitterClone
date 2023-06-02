/*
TODO:

all:
delete and double click
name / tweet too long

fri:
split explore page.
click on following.

sat:
like / retweet / reply.
Notifications (likes, retweets, replies).

sun:
Twitter Blue (stripe).
Route Protection (where necessary).

all:
Images / Polls?
*/

import './style.css';
import './feed.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [post, setPost] = useState('');
  const [tweets, setTweets] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/feed');
        const data = await response.json();
        if (response.ok) {
          setTweets(data.tweets);
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
    setPost('');
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
      body: JSON.stringify({ tweet: post, username: username })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  };  

  const isTweetEmpty = post === '';

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
      <div style={{"z-index": "999"}}className="feed-tweet">
        <div className="feed-tweet-text">
          <input
            id = "tweetinput1"
            type="text"
            placeholder="What's Happening..."
            className="feed-textinput1 input"
            onChange={e => setPost(e.target.value)}
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
      <div className="feed-tweet1">
        <div className="feed-box1" style={{opacity: tweets && tweets.length > 0 ? 100: 0}}>
          <div className="my-tweets">
            {tweets && tweets.length > 0 ? (
              [...tweets].reverse().map((tweet) => (
                <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/profile/${tweet.user._id}`} key={tweet._id}>
                <div className="my-tweet">
                  <div className="tweet-header">
                    <div className="tweet-image"></div>
                    <div className="tweet-username">{tweet.user.username}</div>
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
                </Link>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      <div class="popup">
        <div class="popup-content">
          <form>
            <textarea id="tweet-text" name="tweet" placeholder="What's happening..." onChange={e => setPost(e.target.value)}></textarea>
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