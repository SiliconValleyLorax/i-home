import axios from "axios";
import { useState } from "react";
import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
import { WebcamCapture } from "../components/Webcam";
import Result from "../components/Result";
import BookList from "./BookList";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
// import Book from './Book'

const UploadImage = () => {
  const [uploadOption, setUploadOption] = useState(0);
  const [attachment, setAttachment] = useState(
    "https://i.stack.imgur.com/GNhxO.png"
  );
  const [colors, setColors] = useState(null);
  const [total, setTotal] = useState(1);
  const [label, setLabel] = useState("");

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (attachment === null) return alert("사진을 입력하세요");
    try {
      const response = await axios.post(
        "http://localhost:5000//api/send_image_ex",
        {
          image: attachment,
        }
      );
      setColors(response.data[0]);
      setTotal(response.data[1]);
      setLabel(response.data[2]);
      setUploadOption(3);
    } catch (error) {
      console.log(error);
    }
  };

  // 서버 연결 테스트 코드 - test 버튼으로 동작확인
  const test = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/image", {
        image: attachment,
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  const GiveOption = () => {
    return (
      <>
        <div className="main-container">
          <div className="container-title">
            <span>아이가 좋아하는 장난감, 공간 등을 알려주세요</span>
          </div>
          <button
            onClick={() => setUploadOption(1)}
            className="upload-btn camera-btn"
          >
            <AiFillCamera className="icon-btn photo" />
            <div>
              <Link to="/CameraSet">카메라로 등록</Link>
            </div>
          </button>
          <button
            onClick={() => setUploadOption(2)}
            className="upload-btn gallery-btn"
          >
            <RiGalleryUploadFill className="icon-btn gallery" />
            <div>
              <Link to={"/GallerySet"}>갤러리에서 등록</Link>
            </div>
          </button>
          {/* <button className="upload-btn gallery-btn">
            <RiGalleryUploadFill className="icon-btn gallery" />
            <div>책 찾기</div>
          </button> */}
          <button onClick={test} className="upload-btn gallery-btn">
            <div>test</div>
          </button>
        </div>
      </>
    );
  };

  const WithCam = () => {
    return (
      <>
        <WebcamCapture />
      </>
    );
  };
  const WithAlbum = () => {
    return (
      <>
        <div className="img-holder">
          <img src={attachment} alt="nothing" className="no-image" />
        </div>
        <form onSubmit={onSubmit} className="main-container">
          <input
            type="file"
            accept=".png, .jpg .jpeg"
            onChange={onAttahmentChange}
          />
          <Link
            to={{
              pathname: "/booklist",
              state: {
                image: attachment,
              },
            }}
          >
            <button type="submit" className="submit-btn">
              입력
            </button>
          </Link>
        </form>
      </>
      //입력 버튼에 Link로 bookList 이동 구현
    );
  };
  switch (uploadOption) {
    case 0:
      return <GiveOption></GiveOption>;
    case 1:
      return <WithCam></WithCam>;
    case 2:
      return <WithAlbum></WithAlbum>;
    case 3:
      return (
        <Result
          colors={colors}
          total={total}
          img={attachment}
          label={label}
        ></Result>
      );
    default:
      return;
  }
};

export default UploadImage;
