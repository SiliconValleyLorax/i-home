import "../css/BookDetail.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../css/UploadImage.css";

const BookDetail = ({ id, popClose }) => {
  const [book, setBook] = useState({
    id: null,
    title: null,
    author: null,
    desc: null,
    image: "",
  });
  const [ko, setKo] = useState(0);

  const getbook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/book/${id}`);
      setBook(response.data);
      // setBook({
      //   author: "by Eric Carle",
      //   desc: "THE all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! A sturdy and beautiful book to give as a gift for new babies, baby showers, birthdays, and other new beginnings!",
      //   id: 1,
      //   image: "https://m.media-amazon.com/images/I/71KilybDOoL._AC_UY218_.jpg",
      //   title: "The Very Hungry Caterpillar",
      //   slogan: "한줄평입니다...",
      // });
    } catch (error) {
      console.log("error");
    }
  };
  const getTranslate = () => {
    ko ? setKo(0) : setKo(1);
  };
  useEffect(() => {
    getbook();
  }, []);

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
        <div>
          <button onClick={getTranslate} className="translate-btn">
            번역 보기
          </button>
        </div>
        <div className="copyright"> ©Goodreads </div>

        {ko ? <div></div> : <div className="book_desc">{book.desc_ko}</div>}
      </div>
    </div>
  );
};
export default BookDetail;
