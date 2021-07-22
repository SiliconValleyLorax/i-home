import { Link } from "react-router-dom";
import { useState } from "react";
// import axios from "axios";

const GallerySet = ({ attachment, back, openFile }) => {
  return (
    <>
      <div className="img-holder">
        <img src={attachment} alt="nothing" className="no-image" id="preview" />
      </div>
      <form className="main-container">
        <button type="submit" className="submit-btn" onClick={back}>
          돌아가기
        </button>
        <div
          className="link_css"
          onClick={(e) => {
            e.preventDefault();
            openFile();
          }}
        >
          <button className="submit-btn">다시 선택하기</button>
        </div>
        <Link to={{ pathname: "/bookList", state: { image: attachment } }}>
          <button type="submit" className="submit-btn">
            결과 확인하기
          </button>
        </Link>
      </form>
    </>
  );
};
export default GallerySet;
