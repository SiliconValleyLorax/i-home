//npm install react-camera-pro --save --legacy-peer-deps
//세네 모듈을 설치하고 보니까 가장 최근 설치된 캠 모듈의 성능을 따라가는 듯 하다..
//하나 install 하고 다른 모듈 설치할때는 uninstall하고 다른 캠 모듈 설치!
import React, { useState, useRef } from "react";
import {Camera} from "react-camera-pro";
 
const CameraPro = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
 
  return (
    <div>
      <Camera ref={camera} />
      <button onClick={() => setImage(camera.current.takePhoto())}>Take photo</button>
      <img src={image} alt='Taken photo'/>
    </div>
  );
}
 
export default CameraPro;