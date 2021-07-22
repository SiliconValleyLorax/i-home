import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
// import Book from './Book'
import axios from "axios";
import { useState } from "react";
const UploadImage = () => {
  // const [attachment, setAttachment] = useState(
  //   "https://i.stack.imgur.com/GNhxO.png"
  // );
  // 서버 연결 테스트 코드 - test 버튼으로 동작확인

  const test = async () => {
    let taskID;
    const getTaskID = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        taskID = response.data;
      } catch (e) {
        console.log(e);
      }
    };

    const getResult = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/result", {
          taskID: taskID,
        });
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    const confirmtask = async () => {
      console.log(taskID);
      try {
        const finalresult = await axios.post(
          "http://localhost:5000/api/progress",
          {
            taskID: taskID,
          }
        );
        console.log(finalresult.data);
        if (finalresult.data !== "SUCCESS") {
          setTimeout(() => confirmtask(), 2000);
          return;
        } else getResult();
      } catch (e) {
        console.log(e);
      }
    };
    getTaskID();
    confirmtask();
  };

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
        <Link to={"/GallerySet"} className="link_css">
          <div className="upload-btn gallery-btn">
            <RiGalleryUploadFill className="icon-btn gallery" />
            갤러리로 등록
          </div>
        </Link>
        {/* <button onClick={test} className="upload-btn gallery-btn">
            <div>test</div>
          </button> */}
      </div>
    </>
  );
};

export default UploadImage;
