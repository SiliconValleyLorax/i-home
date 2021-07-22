import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import "../css/Webcam.css";
import { Link } from "react-router-dom";

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

export const WebcamCapture = () => {
  const [image, setImage] = useState("");
  const webcamRef = useRef(null);
  const [fcheck, setFcheck] = useState(0);
  const [gotolist, setGotolist] = useState("CameraSet");
  // eslint-disable-next-line
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setFcheck(1);
    if (imageSrc === null) {
      alert("카메라를 확인해주세요.");
      window.location.reload();
    } else {
      setGotolist("bookList");
    }
  }, [webcamRef]);

  const test_validation = () => {
    if (fcheck === 0) {
      alert("사진을 찍어주세요");
      window.location.reload();
    }
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image === "" || image === null ? (
          <Webcam
            audio={false}
            height={350}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} alt="no-capture" />
        )}
      </div>
      <div className="container">
        {image !== "" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setImage("");
            }}
            className="webcam-btn submit-btn"
          >
            Retake Image
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="webcam-btn submit-btn"
          >
            캡쳐하기
          </button>
        )}
      </div>
      <form className="container">
        <Link
          to={{
            pathname: `/${gotolist}`,
            state: { image: image },
          }}
          onClick={test_validation}
        >
          <button type="submit" className="submit-btn">
            결과 확인하기
          </button>
        </Link>
      </form>
    </div>
  );
};
