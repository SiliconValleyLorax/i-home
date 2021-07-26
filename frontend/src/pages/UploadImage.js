import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
import { useState } from "react";
import GallerySet from "./GallerySet";
// import Book from './Book'
import axios from "axios";

const UploadImage = () => {
  const [option, setOption] = useState(0);
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );

  const test = async () => {
    let taskID;
    const getTaskID = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        taskID = response.data;
        console.log(taskID);
      } catch (e) {
        console.log(e);
      }
    };

    const getResult = async () => {
      try {
        const finalresult = await axios.post(
          "http://localhost:5000/api/result",
          {
            taskID: taskID,
          }
        );
        console.log(taskID, finalresult.data);
        if (finalresult.data === "PROCESSING") {
          setTimeout(() => getResult(), 2000);
          return;
        } else return;
      } catch (e) {
        console.log(e);
      }
    };
    getTaskID();
    // confirmtask();
  };

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
            {/* <div className="upload-btn gallery-btn">
              <RiGalleryUploadFill className="icon-btn gallery" />
              갤러리로 등록
            </div> */}
          </div>
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
