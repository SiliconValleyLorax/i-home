import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
import { useState } from "react";
import GallerySet from "./GallerySet";
// import Book from './Book'
const UploadImage = () => {
  const [option, setOption] = useState(0);
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );

  function openFile() {
    var input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.click();
    input.onchange = function (event) {
      processFile(event.target.files[0]);
    };
  }

  function processFile(file) {
    var reader = new FileReader();

    reader.onload = function () {
      var result = reader.result;
      setAttachment(result);
    };
    reader.readAsDataURL(file);
    setOption(1);
  }

  const showButtons = () => {
    return (
      <>
        <div className="home-container">
          <div className="link_css" onClick={openFile}>
            <img src="/select-photo.png" className="select-photo" />
          </div>
          {/* <Link to="/CameraSet" className="link_css">
            <div className="link_css">
              <img src="/select-photo.png" className="select-photo" />
            </div>
          </Link> */}
          <div className="container-title">
            <span>아이가 좋아하는 장난감을 등록해주세요</span>
          </div>
          {/* <Link to="/CameraSet" className="link_css">
            <div className="upload-btn camera-btn">
              <AiFillCamera className="icon-btn photo" />
              카메라로 등록
            </div>
          </Link> */}

          {/* <button onClick={test} className="upload-btn gallery-btn">
            <div>test</div>
          </button> */}
        </div>
      </>
    );
  };

  const showImagePreview = (attachment) => {
    return (
      <GallerySet
        attachment={attachment}
        back={() => setOption(0)}
        openFile={openFile}
      ></GallerySet>
    );
  };
  switch (option) {
    case 0:
      return showButtons();
    case 1:
      return showImagePreview(attachment);
    default:
      return;
  }
};

export default UploadImage;
