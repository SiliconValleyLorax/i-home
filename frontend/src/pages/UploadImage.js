import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
// import Book from './Book'

const UploadImage = () => {
  // 서버 연결 테스트 코드 - test 버튼으로 동작확인 (지우지 말아주세요ㅠㅠ)
  // const test = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/image", {
  //       image: "https://i.stack.imgur.com/GNhxO.png",
  //     });
  //     console.log(response);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <>
      <div className="main-container">
        <div className="container-title">
          <span>아이가 좋아하는 장난감, 공간 등을 알려주세요</span>
        </div>
        <Link to="/CameraSet">
          <button className="upload-btn camera-btn">
            <AiFillCamera className="icon-btn photo" />
            카메라로 등록
          </button>
        </Link>
        <Link to={"/GallerySet"}>
          <button className="upload-btn gallery-btn">
            <RiGalleryUploadFill className="icon-btn gallery" />
            갤러리로 등록
          </button>
        </Link>
        {/* 서버 통신 테스트 위한 버튼입니다! 지우지 말아주세요ㅠㅠ
        <button onClick={test} className="upload-btn gallery-btn">
            <div>test</div>
          </button> */}
      </div>
    </>
  );
};

export default UploadImage;
