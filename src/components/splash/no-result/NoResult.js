import "./no-result.css";
import image from "../../../assets/images/55024599_9264885.jpg";

function NoResult({
  header = "No Results Found", //default value
  content = "No results were found for this content", //default value
}) {
  return (
    <div className="no__result">
      <img src={image} alt="no result" />
      <h1>{header}</h1>
      <p>{content}</p>
    </div>
  );
}

export default NoResult;
