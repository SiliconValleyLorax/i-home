import React from "react";
import "../css/Home.css";

const Splash = () => {
  const imgUrl = "/splash-image.png";

  return (
    <div>
      <img src={imgUrl} alt="main" className="main-image"></img>
      <div>
        영어 그림책 추천부터 수업까지
        <br />
        한번에 해결하세요!
      </div>
    </div>
  );
};

export default Splash;
