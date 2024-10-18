import "./loading.css";
import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div className="loading">
      <ClipLoader color="#00208a" size={30} />
    </div>
  );
}

export default Loading;
