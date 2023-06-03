import "./style.css"
import "./twitterblue.css"
import React from 'react';

function TwitterBlue() {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.message;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div onClick={handleCheckout} id="popup">
        <img alt="" id="image" src="/twitterblue.jpeg"></img>
        <div id="content">
          <div id="text">Get</div>
          <div id="text">Twitter</div>
          <div id="text">Blue.</div>
        </div>
      </div>
    </div>
  );
}

export default TwitterBlue;