import "../css/BookDetail.css";
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
      console.log(response.data.title);
      setBook(response.data);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    getbook();
  }, []);
  return (
    /*<>
      <div key={book.id}>
        <div className="book-image">
          <div className="linetext">title : {book.title}</div>
          <span className="listAssemble">
            <img src={book.image} alt="book" width="100%" />
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
          <button className="submit-btn">강의 신청하기</button>
        </Link>
      </div>
    </>*/
    <div className="book_detail">
      <div className="book_title">
        <h3>{book.title}</h3>
      </div>
      <div className="book_img">
        <img src={book.image} alt="book" width="100%" />
      </div>
      <div className="book_tag">
        <span className="tag_css">#태그1</span>
        <span className="tag_css">#태그2</span>
        <span className="tag_css">#태그3</span>
      </div>
      <div className="book_author">{book.author}</div>
      <div className="book_desc">{book.desc}</div>
      <Link to="/classRoom">
        <button className="submit-btn">강의 신청하기</button>
      </Link>
    </div>
  );
};
export default BookDetail;
