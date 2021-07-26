import "../css/Loading.css";

const Loading = () => {
  return (
    <div className="main_container">
      <div className="loading-component">
        <div>
          <img
            src="/load-image.gif"
            alt="hi"
            width="100%"
            className="load-img"
          />
        </div>
        <div className="text_container">열심히 분석하고 있어요</div>
      </div>
    </div>
  );
};
export default Loading;
