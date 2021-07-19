import "../css/BookList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const BookList = ({ location }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.
  const [books, setBooks] = useState();
  const getlist = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/image", {
        image: location.state.image,
      });
      console.log(response);
      setBooks(response.data);
    } catch (error) {
      console.log("failed to send image to api server");
    }
  };

  useEffect(() => {
    getlist();
  }, []);
  const tags = [
    ["애벌레", "모험", "곤충"],
    ["동물", "놀이"],
    ["북극곰", "달", "가족"],
    ["할머니", "강아지", "가족"],
  ];

  return (
    //list.map에서 오류가 나서 list && 을 사용해 해결. 어떤 동작으로 에러가 되지 않은지는 모름..
    //라우터/스위치 태그로 값 분기 시도하기
    <>
      <div className="container">
        <div className="book-list-title">추천 도서 목록</div>
        {books &&
          books.map((book) => (
            <div key={book.id} className="book-list">
              <Link
                to={{
                  pathname: `/bookDetail/${book.title}`,
                  state: {
                    id: book.id,
                  },
                }}
                className="listline"
              >
                <div className="book-image">
                  <img src={book.image} alt="book" />
                </div>
                <div className="book-description">
                  <span className="listAssemble">
                    <div className="linetext title">{book.title}</div>
                    <div className="linetext author">Author: {book.author}</div>
                  </span>
                </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default BookList;
