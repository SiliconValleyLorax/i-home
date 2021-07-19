import { Link } from "react-router-dom";
import { useState } from "react";
// import axios from "axios";

const GallerySet = () => {
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );

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
      };
      reader.readAsDataURL(theAttachment);
    } catch (error) {
      return;
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
          accept=".png, .jpg .jpeg"
          onChange={onAttahmentChange}
        />
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
