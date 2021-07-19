// 제가 리액트 공부를 많이 하지는 않아서 url 바꾸는 방법을 잘 몰라서 일단 component처럼 구성하여 uploadimage페이지에 마저 넣었습니다. 무식하게 드려서 죄송해요ㅠㅠ
// 나중에는 페이지 분리하셔야 하니까 여기다가 책 목록 출력하는 페이지 구성하시면 될 것 같아서 pages 폴더에 배치 해두었습니다. 혹시 폴더 구조 이해 안가시면 말씀해주세요!

// 오래 걸린 이유 : api에 요청하는 함수를 여기다가 같이 구성했었는데, 이 페이지가 렌더링 될 때마다 요청하는 함수가 매번 실행되면서 api를 계속 부르는 상황 발생... (무한루프: api 값 받아옴 -> 렌더링 -> 또 받아옴  ->  또 렌더링...) 요청하는 함수는 그냥 컴포넌트에 실행하게 하면 안되고 클릭이나 어떤 액션이 있을 때만 실행하도록 로직을 짜는 것이 좋을 것 같다.

import "../css/BookList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const BookList = ({ attachment }) => {
  // 현재는 모든 도서 목록을 불러오게 되어있지만, 알고리즘 완성 후에는 post 요청으로 이미지(attachment)를 보내서 추천도서 목록을 받아오는 것으로 변경될 예정.
  const [books, setBooks] = useState();
  const getlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/find");
      console.log(response);
      setBooks(response.data);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getlist();
  }, []);
  const tags=[['애벌레','모험','곤충'],['동물','놀이'],['북극곰','달','가족'],['할머니','강아지','가족']]

  return (
    //list.map에서 오류가 나서 list && 을 사용해 해결. 어떤 동작으로 에러가 되지 않은지는 모름..
    //라우터/스위치 태그로 값 분기 시도하기
    <>
    <div class="container">
      <div className="book-list-title">추천 도서 목록</div>
        {books &&
          books.map((book) => (
            <Link to={{
              pathname: `/bookDetail/${book.title}`,
              state: {
                id: book.id
                },
              }} className="listline">
              <div key={book.id} className="book-list">
                <div className="book-image">
                    <img src={book.image} alt="book"/>
                </div>
                <div className="book-description">
                  <span className="listAssemble">
                    <div className="linetext title">{book.title}</div>
                    <div className="linetext author">Author: {book.author}</div>
                  </span>
                </div>
            </div>
            </Link>
          ))
        }
    </div>
    </>
  );
};
export default BookList;
