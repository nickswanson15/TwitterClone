/*
TODO:

mon:
create a /stripe page which just makes a post request to a route that adds check mark to user and redirects to the profile page.
host

all:
Double Click
Comment Count
*/

import './style.css';
import './feed.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [post, setPost] = useState('');
  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState('');
  const [tweetId, setTweetId] = useState(null);
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/feed');
        const data = await response.json();
        if (response.ok) {
          setUser(data.user._id);
          setUsername(data.user.username);
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

  const toggle = async (event) => {
    setPost('');
    const popup = document.querySelector('.popup');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  };

  const toggle1 = async (event) => {
    setReply('');
    const popup1 = document.querySelector('.popup1');
    if (popup1.style.display === 'none') {
      popup1.style.display = 'block';
    } else {
      popup1.style.display = 'none';
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
  
  const handleLike = async (event) => {
    event.preventDefault();
    const response = await fetch('/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tweetId: tweetId })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  };
  
  const handleRetweet = async (event) => {
    event.preventDefault();
    const response = await fetch('/retweet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tweetId: tweetId })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  };
  
  const handleReply = async (event) => {
    event.preventDefault();
    const response = await fetch('/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tweetId: tweetId, replyText: reply })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  }; 

  const isTweetEmpty = post === '';
  const isReplyEmpty = reply === '';

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
      <div className="feed-tweet">
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
                <div className="my-tweet" onMouseEnter={() => setTweetId(tweet._id)}>
                  <div className="tweet-header">
                    <div className="tweet-image"></div>
                    <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/profile/${tweet.user._id}`} key={tweet._id}><div className="tweet-username">{tweet.user.username}</div></Link>
                    <div className="tweet-date">
                    {new Date(tweet.created).toLocaleDateString('default', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <Link style={{ textDecoration: 'none', color: 'inherit'}} to={`/tweet/${tweet._id}`} key={tweet._id}><div className="tweet-content">{tweet.tweet}</div></Link>
                  <div className="tweet-actions">
                  <svg viewBox="0 0 24 24" aria-hidden="true" id={tweet.likes.includes(user) ? "unlike" : "like"} onClick={handleLike}><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                  <div style={{"margin-left": "-12px"}}>{tweet.likes.length}</div>
                  <svg viewBox="0 0 24 24" aria-hidden="true" id={tweet.retweets.includes(user) ? "unretweet" : "retweet"} onClick={handleRetweet}><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                  <div style={{"margin-left": "-12px"}}>{tweet.retweets.length}</div>
                  <svg viewBox="0 0 24 24" aria-hidden="true" id="reply" onClick={toggle1}><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                  <div style={{"margin-left": "-12px"}}>{tweet.replies.length}</div>
                </div>
                </div>
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
      <div class="popup1">
        <div class="popup-content1">
          <form>
            <textarea id="tweet-text" name="tweet" placeholder="Tweet you reply..." onChange={e => setReply(e.target.value)}></textarea>
            <div class="popup-buttons1">
              <button class="popup-button1" type="button" onClick={toggle1}>Cancel</button>
              <button class="popup-button1" type="button" onClick={handleReply} disabled={isReplyEmpty}>Tweet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feed;