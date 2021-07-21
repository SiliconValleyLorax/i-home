import React from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  const imgUrl = "/main-img.jpg";
  return (
    <>
      <div className="main-image">
        <img src={imgUrl} alt="main-image"></img>
        <div className="main-description">
          <div>
            나도 몰랐던 우리 아이 취향, <br /> AI가 찾아준다고?
          </div>
        </div>
      </div>
      <div className="main-section">
        <div className="center">
          <div className="description-title">
            <div>아이의 취향과 관심사에 맞는</div>
            <div>영어 그림책을 추천해드려요.</div>
          </div>
          <div className="description-subtitle">
            좋아하는 장난감 사진만 업로드하면 끝!
          </div>
          <Link to="/uploadImage">
            <button className="start-btn">확인하러가기</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
