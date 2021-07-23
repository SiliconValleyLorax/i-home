import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
import { useState } from "react";
import GallerySet from "./GallerySet";
// import Book from './Book'
import axios from "axios";
import { useState } from "react";
const UploadImage = () => {
  const [option, setOption] = useState(0);
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );
  // 서버 연결 테스트 코드 - test 버튼으로 동작확인
  // const test = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/image", {
  //       image: attachment,
  //     });
  //     console.log(response);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
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
        <div className="main-container">
          <div className="container-title">
            <span>아이가 좋아하는 장난감, 공간 등을 알려주세요</span>
          </div>
          <Link to="/CameraSet" className="link_css">
            <div className="upload-btn camera-btn">
              <AiFillCamera className="icon-btn photo" />
              카메라로 등록
            </div>
          </Link>
          <div className="link_css" onClick={openFile}>
            <div className="upload-btn gallery-btn">
              <RiGalleryUploadFill className="icon-btn gallery" />
              갤러리로 등록
            </div>
          </div>
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
