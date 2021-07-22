import "../css/Loading.css";

const Loading = () => {
  return (
    <div className="main_container">
      <div>
        <img
          src="https://media4.giphy.com/media/xT9IgMW9W4y9K4PtTi/giphy.gif?cid=ecf05e47f137u9rqd0wwrheups4hd4bxhq39uqq5ycp71edr&rid=giphy.gif&ct=g"
          alt="hi"
          width="100%"
        />
      </div>
      <div className="text_container">추천 책 찾는 중 ...</div>
    </div>
  );
};
export default Loading;
