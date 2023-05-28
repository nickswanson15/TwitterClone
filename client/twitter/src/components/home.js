import "./home.css"
import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="container">
        <div className="image-container">
            <img src="home.png" alt="logo"/>
        </div>
        <div className="content-container">
            <h1>Happening Now.</h1>
            <h3>Join Twitter Today!</h3>
            <Link to="/login">Log In</Link>
            <br></br>
            <Link to="/signup">Sign Up</Link>
        </div>
    </div>
  );
}

export default Home;
