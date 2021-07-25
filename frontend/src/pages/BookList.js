import "../css/BookList.css";
import "../css/Main.css";
import { Link } from "react-router-dom";
import Loading2 from "../components/Loading2";
import axios from "axios";
import { useEffect, useState } from "react";

const BookList = ({ location }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.
  const [books, setBooks] = useState();
  const [loading, setLoading] = useState(true);
  const [phrase, setPhrase] = useState("");

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
          setPhrase("이런 책을 추천해요");
        } else if (response.data.state === "FAIL") {
          console.log("Can't find label");
          setBooks(response.data.result);
          setLoading(false);
          setPhrase("책을 찾을 수 없어요");
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
        setLoading(false);
        setBooks([]);
        setPhrase("책을 찾을 수 없어요");
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
        <>
          <div className="home-container">
            {/* <div className="book-list-title">추천 도서 목록</div> */}
            <div className="book-list-sub-title">{phrase}</div>
            {books &&
              books.map((book, index) => (
                <div className="book-list" key={book.id}>
                  {/* <div className="book-rank">{index + 1}</div> */}
                  <Link
                    to={{
                      pathname: `/bookDetail/${book.title}`,
                      state: { id: book.id },
                    }}
                    className="listline"
                  >
                    <div className="book-image">
                      <img src={book.image} alt="book" />
                    </div>
                    <div className="book-description">
                      <span className="listAssemble">
                        <div>{book.slogan}</div>
                        {/* <div className="linetext title">{book.title}</div>
                        <div className="linetext author">
                          Author: {book.author}
                        </div> */}
                      </span>
                    </div>
                  </Link>
                  <button className="button-css">
                    <img src="/zoom-logo.png" className="num-logo" />줌 수업
                    신청하기
                  </button>
                </div>
              ))}
          </div>
        </>
      );
    default:
      return;
  }
};
export default BookList;
