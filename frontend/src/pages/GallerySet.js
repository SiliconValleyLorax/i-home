import { Link } from "react-router-dom";
import { useState } from "react";
// import axios from "axios";

const GallerySet = () => {
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );
  const [fcheck, setFcheck] = useState(0);
  const [gotolist, setGotolist] = useState("GallerySet");

  const onAttahmentChange = (event) => {
    try {
      const {
        target: { files },
      } = event;
      const theAttachment = files[0];
      const reader = new FileReader();
      reader.onloadend = (fininshedEvent) => {
        const {
          currentTarget: { result },
        } = fininshedEvent;
        setAttachment(result);
        setFcheck(1);
      };
      reader.readAsDataURL(theAttachment);
    } catch (error) {
      return;
    }
  };
  const test_validation = () => {
    if (fcheck === 0) {
      alert("사진을 등록해주세요.");
      window.location.reload();
    } else {
      setGotolist("bookList");
    }
  };

  return (
    <>
      <div className="img-holder">
        <img src={attachment} alt="nothing" className="no-image" />
      </div>
      <form className="main-container">
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={onAttahmentChange}
          className="submit-btn"
        />
        <Link to={{ pathname: `/${gotolist}`, state: { image: attachment } }}>
          <button
            type="submit"
            className="submit-btn"
            onClick={test_validation}
          >
            결과 확인하기
          </button>
        </Link>
      </form>
    </>
  );
};
export default GallerySet;
