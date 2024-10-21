import DashboardFooter from "../../components/layout/footer/Dashboard.footer";
import "./not-found.css";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/rb_28607.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="not__found">
        <img src={image} alt="not-found" />
        <h1>404 NOT FOUND</h1>
        <p>OOPS! We can't seem to find the page you're looking for</p>
        <h3
          onClick={() => {
            navigate("/main");
          }}
        >
          Go back to home page
        </h3>
      </section>
    </div>
  );
}

export default NotFound;
