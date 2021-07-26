import "../css/BookList.css";
import "../css/Main.css";
import { Link, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import BookDetail from "./BookDetail";

const BookList = ({ location }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.\

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phrase, setPhrase] = useState("책을 찾을 수 없어요");

  // const [image, setImage] = useState(null);
  const [popup, setPopup] = useState(false);
  const [bookId, setBookId] = useState("");
  const getResult = (taskId) => {
    axios
      .post("http://localhost:5000/api/result", { taskID: taskId })
      .then((response) => {
        if (response.data.state === "PROCESSING") {
          console.log(taskId, response);
          setTimeout(() => getResult(taskId), 2000);
        } else if (response.data.state === "SUCCESS") {
          setBooks(response.data.result);
          setPhrase("이런 책을 추천해요");
          setLoading(false);
        } else if (response.data.state === "FAIL") {
          console.log("Can't find label");
          setBooks(response.data.result);
          setLoading(false);
        } else {
          console.log(response.data, "Failed to get bookList from server");
          setLoading(false);
        }
      })
      .catch(() => {
        console.log("Failed to get bookList from server");
        setLoading(false);
      });
  };

  const getlist = () => {
    if (location.state === undefined) return;
    axios
      .post(
        "http://localhost:5000/api/image",
        {
          image: location.state.image,
        },
        {
          validateStatus: function (status) {
            // 상태 코드가 500 이상일 경우 거부. 나머지(500보다 작은)는 허용.
            return status < 500;
          },
        }
      )
      .then((response) => {
        if (response.status === 400) {
          setPhrase("이미지를 .png, .jpg, .jpeg 형식으로 올려주세요");
          setLoading(false);
          return;
        }
        console.log(response.data);
        getResult(response.data);
      })
      .catch((error) => {
        console.log("failed to send image to api server");
        console.log(error);
      });
  };

  useEffect(() => {
    getlist();
  }, []);
  if (location.state === undefined) {
    return <Redirect to="/" />;
  }
  switch (loading) {
    case true:
      return <Loading></Loading>;
    case false:
      if (popup === false) {
        return (
          <>
            <div className="home-container">
              {/* <div className="book-list-title">추천 도서 목록</div> */}
              <div className="book-list-sub-title">이런 책을 추천해요</div>
              {books &&
                books.map((book, index) => (
                  <div className="book-list" key={book.id}>
                    {/* <div className="book-rank">{index + 1}</div> */}
                    <div
                      onClick={() => {
                        setPopup(true);
                        setBookId(book.id);
                        // console.log("true");
                      }}
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
                    </div>
                    <button className="button-css">
                      <img src="/zoom-logo.png" className="num-logo" />줌 수업
                      신청하기
                    </button>
                  </div>
                ))}
            </div>
          </>
        );
      } else {
        return <BookDetail id={bookId} popClose={setPopup}></BookDetail>;
      }

    default:
      return;
  }
};
export default BookList;
