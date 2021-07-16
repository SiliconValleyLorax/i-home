import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "../css/Webcam.css";
import { Link } from "react-router-dom";

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

export const WebcamCapture = () => {
  const [image, setImage] = useState("");
  // const [colors, setColors] = useState(null);
  // const [total, setTotal] = useState(1);
  const [label, setLabel] = useState("");
  const webcamRef = useRef(null);

  // eslint-disable-next-line
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);}, [webcamRef]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/send_image", {
        image: image,
      });
      console.log(response.data);
      console.log(response.data[2]);
      // setColors(response.data[0]);
      // setTotal(response.data[1]);
      setLabel(response.data[2]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image === "" ? (
          <Webcam
            audio={false}
            height={380}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={380}
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
            className="webcam-btn"
          >
            Retake Image
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="webcam-btn "
          >
            캡쳐하기
          </button>
        )}
      </div>
      <form onSubmit={onSubmit} className="container">
        <Link to="/bookList">
          <button type="submit" className="submit-btn">
            결과 확인하기
          </button>
        </Link>
        
      </form>
      <div className="container result-title">
        {(label !== "") & (image !== "") ? (
          <div>결과는 : {label}</div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};