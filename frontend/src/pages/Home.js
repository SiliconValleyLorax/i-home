import React from "react";
// import "../css/Home.css";
import "../css/Main.css";
import { Link } from "react-router-dom";
import Splash from "../components/Splash";
<<<<<<< Updated upstream
import { useState } from "react";

=======
>>>>>>> Stashed changes
const Home = () => {
  // window.onload = setTimeout(Sethome, 5000);
  // clearTimeout();
  const imgUrl = "/splash-image.png";
<<<<<<< Updated upstream
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
=======

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
>>>>>>> Stashed changes
        </div>
        <Link to="/uploadImage">
          <button className="button-css">시작하기</button>
        </Link>
      </div>
<<<<<<< Updated upstream
    );
  }

=======
      <Link to="/uploadImage">
        <button className="button-css">시작하기</button>
      </Link>
    </div>
  );
>>>>>>> Stashed changes
  // return (
  //   <>
  //     <div className="main-image">
  //       <img src={imgUrl} alt="main"></img>
  //       <div className="main-description">
  //         <div>
  //           나도 몰랐던 우리 아이 취향, <br /> AI가 찾아준다고?
  //         </div>
  //       </div>
  //     </div>
  //     <div className="main-section">
  //       <div className="center">
  //         <div className="description-title">
  //           <div>아이의 취향과 관심사에 맞는</div>
  //           <div>영어 그림책을 추천해드려요.</div>
  //         </div>
  //         <div className="description-subtitle">
  //           좋아하는 장난감 사진만 업로드하면 끝!
  //         </div>
  //         <Link to="/uploadImage">
  //           <button className="start-btn">확인하러가기</button>
  //         </Link>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default Home;
