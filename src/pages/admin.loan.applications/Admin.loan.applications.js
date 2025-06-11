import "./Admin.loan.applications.css";
import { PiCircleFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLoanApplications } from "../../redux/actions/applicationAction";
import { useEffect, useState } from "react";
import { ngDateFormat } from "../../utils/time";
import LoanStats from "./LoanStats";

function AdminLoanApplication() {
  const getLoanApplications = useGetLoanApplications();
  const {status} = useParams();
  console.log(status);
  
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const loanStatusMap = {
    "pending": {
      text:"pending",
      color: "text-yellow-600",
    },

    "approved": {
      text:"active",
      color: "text-green-600",
    },

    "declined": {
      text:"rejected",
      color: "text-red-600",
    },

    "completed":{
      text:"inactive",
      color: "text-blue-600"
    }
  }

  const handleGetLoanApplications = async () => {
    setLoading(true);
    try {
      const response = await getLoanApplications(loanStatusMap[status]["text"]);
      if (response?.payload.success === true) {
        setErrorMessage("");
        setResult(response.payload.data.result);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLoanApplications();
  }, [status]);

  return (
    <>
      <div className="ad__student__app">
        <LoanStats />
        <section className="ad__student__app__section__two">
          <div className="ad__student__app__section__two__header">
            <h1 className="ad__student__app__section__two__header__date">
               Date Applied
            </h1>
            <h1 className="ad__student__app__section__two__header__id">
              Loan ID
            </h1>
            <h1 className="ad__student__app__section__two__header__university">
              Name
            </h1>
            <h1 className="ad__student__app__section__two__header__universityemail">
              Amount
            </h1>
            <h1 className="ad__student__app__section__two__header__university">
              Society
            </h1>

            <h1 className="ad__student__app__section__two__header__userid">
               Phone 
            </h1>
            <h1 className="ad__student__app__section__two__header__status">
              Status
            </h1>
          </div>

          {result.map((item, i) => {
            return (
              <div
                key={i}
                className="ad__student__app__section__two__entry"
                onClick={() => {
                  navigate(`/main/loan-application/${item.id}`);
                }}
              >
                <h1 className="ad__student__app__section__two__entry__date">
                  {ngDateFormat(item.createdAt)}
                </h1>
                <h1 className="ad__student__app__section__two__entry__id">
                  {item.id}
                </h1>
                <h1 className="ad__student__app__section__two__entry__university">
                  {`${item.firstName} ${item.lastName}`}
                </h1>
                <h1 className="ad__student__app__section__two__entry__universityemail">
                  {item.amount}
                </h1>
                <h1 className="ad__student__app__section__two__entry__university">
                  {item.group?.name}
                </h1>
                <h1 className="ad__student__app__section__two__entry__userid">
                  {item.phone}
                </h1>
                <h1 className={`ad__student__app__section__two__entry__status flex justify-center text-center ${loanStatusMap[status]['color']}`}>
                  <span>
                    <PiCircleFill
                      className="{loanStatusMap[status]['color']}"
                    />{" "}
                    {item.status}
                  </span>
                </h1>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default AdminLoanApplication;
