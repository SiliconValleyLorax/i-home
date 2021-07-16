//npm install react-cam 실행
import React, { Fragment, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Camera } from 'react-cam';

function capture(imgSrc) {
  console.log(imgSrc);
}

const Cam = () => {
  const cam = useRef(null);
  return (
    <>
      <Camera
        showFocus={true}
        front={false}
        capture={capture}
        ref={cam}
        width="80%"
        height="auto"
        focusWidth="80%"
        focusHeight="60%"
        btnColor="white"
      />
      <button onClick={img => cam.current.capture(img)}>Take image</button>
    </>
  );
};
ReactDOM.render(<Cam />, document.getElementById('root'));

export default Cam;
//다른 캠 모듈에 비해 화질도 별로 안좋음..
//모바일엔 당연히 안 뜸ㅠㅠ 모바일도 된다며 ㅠㅠㅠㅠ