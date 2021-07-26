import { Link } from "react-router-dom";
import { useState } from "react";
// import axios from "axios";
import "../css/Main.css";

const GallerySet = ({ attachment, back, openFile }) => {
  return (
    <div className="home-container">
      <div className="img-holder">
        <img src={attachment} alt="nothing" className="no-image" id="preview" />
      </div>
      <form className="form-css">
        <button
          type="submit"
          className="button-css gallery-button"
          onClick={back}
        >
          돌아가기
        </button>
        <div
          className="link_css"
          onClick={(e) => {
            e.preventDefault();
            openFile();
          }}
        >
          <button className="button-css gallery-button">다시 선택하기</button>
        </div>
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
