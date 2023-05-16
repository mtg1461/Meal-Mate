import WelcomeCSS from "./style/welcome.module.css";
import React from 'react'

const WelcomePage = () => {
  const buttonStyle = {
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
    border: "none",
    boxShadow: "0 0 8px black",
    fontSize: "1.2rem",
    borderRadius: "15px",
    marginTop: "30px",
    padding: "8px"
  }
  return (
    <div className={WelcomeCSS}>
        <div className={WelcomeCSS.box}>
            <h1>MEAL MATE</h1>
            <p>by MTG</p>   
            <a href="/ComparisonPage">
                <button style={buttonStyle}>Get Started!</button>
            </a>
        </div>   
    </div>
  )
}

export default WelcomePage
