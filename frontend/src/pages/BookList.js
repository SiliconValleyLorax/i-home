import "../css/BookList.css";
import "../css/Main.css";
import { Link, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import BookDetail from "./BookDetail";

const BookList = ({ location }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phrase, setPhrase] = useState("책을 찾을 수 없어요");

  // const [image, setImage] = useState(null);
  const [popup, setPopup] = useState(false);
  // const [bookId, setBookId] = useState("");
  const [book, setBook] = useState({
    id: null,
    title: null,
    author: null,
    desc: null,
    image: "",
  });
  const getbook = async (id) => {
    try {
      const response = await axios.get(
        `http://ihome-eng.tk:5000/api/book/${id}`
      );
      setBook(response.data);
      setPopup(true);
    } catch (error) {
      console.log("error");
    }
  };
  const getResult = (taskId) => {
    axios
      .get(`http://ihome-eng.tk:5000/api/result/${taskId}`)
      .then((response) => {
        if (response.data.state === "PROCESSING") {
          setTimeout(() => getResult(taskId), 1500);
        } else if (response.data.state === "SUCCESS") {
          setBooks(response.data.result);
          setPhrase("이런 책을 추천해요");
          setLoading(false);
        } else if (response.data.state === "FAIL") {
          console.log("Can't find label");
          setBooks(response.data.result);
          setLoading(false);
        } else {
          console.log("Failed to get bookList from server");
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
        "http://ihome-eng.tk:5000/api/image",
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
        // console.log(response.data);
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
      return (
        <>
          {popup && <BookDetail book={book} popClose={setPopup}></BookDetail>}
          <div
            className="home-container"
            style={{
              touchAction: popup ? "none" : "auto",
              overflowY: popup ? "hidden" : "visible",
            }}
            onScroll={(e) => {
              if (popup) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {/* <div className="book-list-title">추천 도서 목록</div> */}
            <div
              className="book-list-sub-title"
              style={{
                touchAction: popup ? "none" : "auto",
                overflowY: popup ? "hidden" : "visible",
              }}
              onScroll={(e) => {
                if (popup) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {phrase}
            </div>
            {books &&
              books.map((book, index) => (
                <div
                  className="book-list"
                  key={book.id}
                  style={{
                    touchAction: popup ? "none" : "auto",
                    overflowY: popup ? "hidden" : "visible",
                  }}
                  onScroll={(e) => {
                    if (popup) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {/* <div className="book-rank">{index + 1}</div> */}
                  <div
                    style={{
                      touchAction: popup ? "none" : "auto",
                      overflowY: popup ? "hidden" : "visible",
                    }}
                    onScroll={(e) => {
                      if (popup) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onClick={() => {
                      getbook(book.id);
                      // setBookId(book.id);
                    }}
                  >
                    <div
                      className="book-image"
                      style={{
                        touchAction: popup ? "none" : "auto",
                        overflowY: popup ? "hidden" : "visible",
                      }}
                      onScroll={(e) => {
                        if (popup) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <img
                        src={book.image}
                        alt="book"
                        style={{
                          touchAction: popup ? "none" : "auto",
                          overflowY: popup ? "hidden" : "visible",
                        }}
                        onScroll={(e) => {
                          if (popup) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      />
                    </div>
                    <div
                      className="book-description"
                      style={{
                        touchAction: popup ? "none" : "auto",
                        overflowY: popup ? "hidden" : "visible",
                      }}
                      onScroll={(e) => {
                        if (popup) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <span
                        className="listAssemble"
                        style={{
                          touchAction: popup ? "none" : "auto",
                          overflowY: popup ? "hidden" : "visible",
                        }}
                        onScroll={(e) => {
                          if (popup) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        <div
                          style={{
                            touchAction: popup ? "none" : "auto",
                            overflowY: popup ? "hidden" : "visible",
                          }}
                          onScroll={(e) => {
                            if (popup) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          {book.slogan}
                        </div>
                        {/* <div className="linetext title">{book.title}</div>
                          <div className="linetext author">
                            Author: {book.author}
                          </div> */}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://forms.gle/2CCCGf2R258YnHsE9"
                    target="_blank"
                    className="button-css"
                  >
                    <img src="/zoom-logo.png" className="num-logo" />줌 수업
                    신청하기
                  </a>
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
