import "../css/BookList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../css/UploadImage.css";

const BookDetail = ({ location }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.
  const [book, setBook] = useState({
    id: 0,
    title: 0,
    author: 0,
    desc: 0,
    image: "",
  });
  const getbook = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/book/${location.state.id}`
      );
      setBook(response.data);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    getbook();
  }, []);
  return (
    <>
      <div>
        <div className="book-image">
          <span className="listAssemble">
            <img src={book.image} alt="book" width="50px" />
          </span>
        </div>
        <div className="book-description">
          <span className="listAssemble">
            <div className="linetext">title : {book.title}</div>
            <div className="linetext">author : {book.author}</div>
            <div className="linetext">description : {book.desc}</div>
          </span>
        </div>
        <Link to="/classRoom">
          <button className="submit-btn">수업 리스트</button>
        </Link>
      </div>
    </>
  );
};
export default BookDetail;
