import React from "react";
// import "../css/Home.css";
import "../css/Main.css";
import { Link } from "react-router-dom";
import Splash from "../components/Splash";
import { useState } from "react";

const Home = () => {
  // window.onload = setTimeout(Sethome, 5000);
  // clearTimeout();
  const imgUrl = "/splash-image.png";
  const [screen, setScreen] = useState(true);

  setTimeout(() => {
    setScreen(false);
  }, 3000);

  if (screen === true) {
    return (
      <div className="home-container">
        <div>
          <Splash></Splash>
        </div>
      </div>
    );
  } else {
    return (
      <div className="home-container">
        <div className="home-desc">
          <div className="desc-line">
            <span className="num-logo">
              <img src="/num1.png" className="num-logo" />
            </span>
            <span className="desc-text">
              아이의 취향과 관심사에 맞는 영어 그림책을 추천해드려요.
            </span>
          </div>
          <div className="desc-line">
            <span className="num-logo">
              <img src="/num2.png" className="num-logo" />
            </span>
            <span className="desc-text">
              아이가 좋아하는 그림책으로 줌 수업을 해드려요.
            </span>
          </div>
          <div className="desc-line">
            <span className="num-logo">
              <img src="/num3.png" className="num-logo" />
            </span>
            <span className="desc-text">
              영어 그림책을 읽고 재미있는 액티비티를 함께 즐겨요!
            </span>
          </div>
        </div>
        <Link to="/uploadImage">
          <button className="button-css">시작하기</button>
        </Link>
      </div>
    );
  }
};

export default Home;
