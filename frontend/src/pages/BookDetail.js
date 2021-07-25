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
  const [ko, setKo] = useState(0);

  const getbook = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/book/${location.state.id}`
      );
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
    <>
      <div className="book_detail">
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

        {ko ? <div></div> : <div className="book_desc">{book.desc_ko}</div>}
      </div>
    </>
  );
};
export default BookDetail;
