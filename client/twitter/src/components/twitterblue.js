import "./twitterblue.css";
import CheckoutForm from "./checkoutform";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";

const stripePromise = loadStripe("pk_live_51NEoEwGjCmRHchXX1fsZ7WeSwaFCQi6WpzbGSw8YbhfJNzLxsVHkfdSKaSczep6vmJIyug5O1OGjsXMDXBMtpPI000rRkRmvTG");

export default function TwitterBlue() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'flat',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div id="outer-div">
      <Link to="/feed">
      <img id="img" alt="" src="./home.png"></img>
      </Link>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}