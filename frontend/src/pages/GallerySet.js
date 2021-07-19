import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const GallerySet = () => {
    
    const [colors, setColors] = useState(null);
    const [total, setTotal] = useState(1);
    const [label, setLabel] = useState("");
    const [uploadOption, setUploadOption] = useState(0);

    const [attachment, setAttachment] = useState(
        "https://i.stack.imgur.com/GNhxO.png"
    );

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
  
    return(
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
            <Link to="/bookList">
                <button type="submit" className="submit-btn">
                결과 확인하기
                </button>
            </Link>
            </form>
        </>
    );
};
export default GallerySet;