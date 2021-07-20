import "../css/UploadImage.css";
import { AiFillCamera } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
//booklist 페이지 전환 위해 임포트
import { Link } from "react-router-dom";
// import Book from './Book'
import axios from "axios";
const UploadImage = () => {
  // const [attachment, setAttachment] = useState(
  //   "https://i.stack.imgur.com/GNhxO.png"
  // );
  // 서버 연결 테스트 코드 - test 버튼으로 동작확인
  const confirmtask = async (id) => {
    let progress = await axios.post("http://localhost:5000/api/progress", {
      taskID: id,
    });
    if (progress.data === "SUCCESS") return console.log("complete");
    setTimeout(() => confirmtask(id), 2000);
  };
  const test = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test");
      console.log(response.data);
      console.log("calling api/progress...");
      // confirmtask(response.data);
      // setTimeout(async () => {
      //   const finalresult = await axios.post(
      //     "http://localhost:5000/api/result",
      //     {
      //       taskID: response.data,
      //     }
      //   );
      //   console.log(finalresult.data);
      // }, 30000);
      // console.log(progress);

      // console.log(finalresult.data);
    } catch (e) {
      console.log(e);
    }
  };

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
        <button onClick={test} className="upload-btn gallery-btn">
          <div>test</div>
        </button>
      </div>
    </>
  );
};

export default UploadImage;
