import "../css/BookDetail.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../css/UploadImage.css";

const BookDetail = ({ popClose, book }) => {
  const [ko, setKo] = useState(false);

  // useEffect(() => {
  //   getbook();
  // }, []);

  return (
    <div className="background">
      <div className="book_detail">
        <div className="close-button">
          <img
            src="/close.png"
            onClick={() => {
              popClose(false);
            }}
          />
        </div>
        <div>
          <img src={book.image} alt="book" width="100%" className="book_img" />
        </div>
        <div className="book_title">
          <h3>{book.title}</h3>
        </div>
        <div className="book_author">{book.author}</div>
        <div className="book_desc">{book.desc}</div>
        <div className="copyright"> ©Goodreads </div>
        <div>
          <button onClick={() => setKo(!ko)} className="translate-btn">
            {ko ? "숨기기" : "번역 보기"}
          </button>
        </div>
        {ko ? <div className="book_desc">{book.desc_ko}</div> : <div></div>}
      </div>
    </div>
  );
};
export default BookDetail;
