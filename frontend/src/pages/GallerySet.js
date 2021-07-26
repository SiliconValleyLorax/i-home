import { Link } from "react-router-dom";
import { useState } from "react";
// import axios from "axios";
import "../css/Main.css";

const GallerySet = ({ attachment, back, openFile }) => {
  return (
    <div className="home-container">
      <div className="img-holder">
        <div
          onClick={(e) => {
            e.preventDefault();
            openFile();
          }}
        >
          <img src="gclose.jpg" className="reset-button" />
        </div>
        <img src={attachment} alt="nothing" className="no-image" id="preview" />
      </div>
      <div className="img-text">
        X 버튼을 누르면 사진을 다시 등록할 수 있습니다
      </div>
      <form className="form-css">
        {/* <button
          type="submit"
          className="button-css gallery-button"
          onClick={back}
        >
          돌아가기
        </button> */}
        <Link to={{ pathname: "/bookList", state: { image: attachment } }}>
          <button type="submit" className="button-css gallery-button">
            아이 취향 분석하기
          </button>
        </Link>
      </form>
    </div>
  );
};
export default GallerySet;
