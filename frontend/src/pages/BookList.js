import "../css/BookList.css";
import { Link } from "react-router-dom";
import Loading2 from "../components/Loading2";
import axios from "axios";
import { useEffect, useState } from "react";

const BookList = ({ location }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.
  const [books, setBooks] = useState();
  const [loading, setLoading] = useState(true);

  const getResult = (taskId) => {
    axios
      .post("http://localhost:5000/api/result", { taskID: taskId })
      .then((response) => {
        if (response.data.state === "PROCESSING") {
          console.log(taskId, response.data.state);
          setTimeout(() => getResult(taskId), 2000);
        } else if (response.data.state === "SUCCESS") {
          setBooks(response.data.result);
          setLoading(false);
        } else if (response.data.state === "FAIL") {
          console.log("Can't find label");
          setBooks(response.data.result);
          setLoading(false);
        } else console.log(response.data, "Failed to get bookList from server");
      })
      .catch(() => {
        console.log("Failed to get bookList from server");
      });
  };

  const getlist = () => {
    axios
      .post("http://localhost:5000/api/image", {
        image: location.state.image,
      })
      .then((response) => {
        console.log(response.data);
        getResult(response.data);
      })
      .catch(() => {
        console.log("failed to send image to api server");
      });
  };

  useEffect(() => {
    getlist();
  }, []);

  switch (loading) {
    case true:
      return <Loading2></Loading2>;
    case false:
      return (
        //list.map에서 오류가 나서 list && 을 사용해 해결. 어떤 동작으로 에러가 되지 않은지는 모름..
        //라우터/스위치 태그로 값 분기 시도하기
        <>
          <div className="container">
            <div className="book-list-title">추천 도서 목록</div>
            <div className="book-list-sub-title">
              우리 아이에게 딱 맞는 그림책은?
            </div>
            {books &&
              books.map((book, index) => (
                <Link
                  to={{
                    pathname: `/bookDetail/${book.title}`,
                    state: {
                      id: book.id,
                    },
                  }}
                  className="listline"
                  key={book.id}
                >
                  <div className="book-list">
                    <div className="book-rank">{index + 1}</div>
                    <div className="book-image">
                      <img src={book.image} alt="book" />
                    </div>
                    <div className="book-description">
                      <span className="listAssemble">
                        <div className="linetext title">{book.title}</div>
                        <div className="linetext author">
                          Slogan: {book.slogan}
                        </div>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </>
      );
    default:
      return;
  }
};
export default BookList;
