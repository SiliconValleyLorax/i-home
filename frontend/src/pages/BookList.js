// 제가 리액트 공부를 많이 하지는 않아서 url 바꾸는 방법을 잘 몰라서 일단 component처럼 구성하여 uploadimage페이지에 마저 넣었습니다. 무식하게 드려서 죄송해요ㅠㅠ
// 나중에는 페이지 분리하셔야 하니까 여기다가 책 목록 출력하는 페이지 구성하시면 될 것 같아서 pages 폴더에 배치 해두었습니다. 혹시 폴더 구조 이해 안가시면 말씀해주세요!

// 오래 걸린 이유 : api에 요청하는 함수를 여기다가 같이 구성했었는데, 이 페이지가 렌더링 될 때마다 요청하는 함수가 매번 실행되면서 api를 계속 부르는 상황 발생... (무한루프: api 값 받아옴 -> 렌더링 -> 또 받아옴  ->  또 렌더링...) 요청하는 함수는 그냥 컴포넌트에 실행하게 하면 안되고 클릭이나 어떤 액션이 있을 때만 실행하도록 로직을 짜는 것이 좋을 것 같다.

import "../css/BookList.css";
import { Link } from 'react-router-dom';


const BookList = ({ list }) => {
  //console.log(list);

  const hi = () => {
    return (
      <Link to="/BookDetail"></Link>
    )
  };
  
  const bookdetail = () => {
    return(
      "/BookDetail"
    )//db 인덱스 값으로 페이지 uri분기 만들기
  }
  return (
    //list.map에서 오류가 나서 list && 을 사용해 해결. 어떤 동작으로 에러가 되지 않은지는 모름..
    <>
      {list && list.map((book) => (
        <div  key={book[0]} onClick={hi}>
          <Link to={bookdetail} className="listline">
            
            <div className="book-image">
              <span className="listAssemble">
                <img src={book[3]} alt="book" width="50px" />
              </span>
            </div>

            <div className="book-description">
              <span className="listAssemble">
                <div className="linetext">title : {book[1]}</div>
                <div className="linetext">author : {book[2]}</div>
              </span>
            </div>
          </Link>
          <hr></hr>
        </div>
      ))}
    </>
  );
};
export default BookList;