const Result = ({ colors, total, img, label }) => {
  console.log(colors);
  colors = Object.entries(colors);
  return (
    <>
      <div className="img-holder">
        <div>{label}</div>
        <img src={img} width="100px" alt="nothing" className="no-image" />
      </div>
      {colors.map((colorData) => {
        return (
          <div
            key={colorData[0]}
            style={{
              backgroundColor: colorData[1][1],
            }}
          >
            {(colorData[1][0] / total) * 100}%
          </div>
        );
      })}
    </>
  );
};

export default Result;
