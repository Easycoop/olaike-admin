import { FaFile, FaFileExcel, FaFileImport } from "react-icons/fa";
import "./Admin.loan.applications.css";
import { PiCircleFill } from "react-icons/pi";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetLoanApplications } from "../../redux/actions/applicationAction";
import { useEffect, useState } from "react";

function AdminLoanApplication() {
  const getLoanApplications = useGetLoanApplications();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const handleGetLoanApplications = async () => {
    setLoading(true);
    try {
      const response = await getLoanApplications();
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
  }, []);

  return (
    <>
      <div className="ad__student__app">
        <section className="ad__student__app__section__one">
          <span className="ad__student__app__section__header">
            <h1>Loan application summary</h1>
            <select name="Timeline" id="Timeline">
              <option value={null}>This month</option>
              <option value="1">Last month</option>
              <option value="2">Last 6 months</option>
              <option value="3">Last 1 year</option>
            </select>
          </span>
          <article className="ad__student__app__section__article">
            <div className="ad__student__app__section__one__card">
              <FaFile className="ad__student__app__section__one__card__icon one" />
              <div>
                <h3>Total applications</h3>
                <h1>{result.length}</h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileCircleCheck className="ad__student__app__section__one__card__icon two" />
              <div>
                <h3>Successful applications</h3>
                <h1>
                  {
                    result.filter(function (item, i) {
                      if (result[i].status == "active") {
                        return result[i];
                      }
                    }).length
                  }
                </h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileImport className="ad__student__app__section__one__card__icon three" />
              <div>
                <h3>Pending applications</h3>
                <h1>
                  {
                    result.filter(function (item, i) {
                      if (result[i].status == "pending") {
                        return result[i];
                      }
                    }).length
                  }
                </h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileExcel className="ad__student__app__section__one__card__icon four" />
              <div>
                <h3>Unsuccessful applications</h3>
                <h1>
                  {
                    result.filter(function (item, i) {
                      if (result[i].status == "inactive") {
                        return result[i];
                      }
                    }).length
                  }
                </h1>
              </div>
            </div>
          </article>
        </section>
        <section className="ad__student__app__section__two">
          <div className="ad__student__app__section__two__header">
            <h1 className="ad__student__app__section__two__header__date">
              Application date
            </h1>
            <h1 className="ad__student__app__section__two__header__id">
              Application ID
            </h1>
            <h1 className="ad__student__app__section__two__header__university">
              Name
            </h1>
            <h1 className="ad__student__app__section__two__header__universityemail">
              Amount
            </h1>

            <h1 className="ad__student__app__section__two__header__userid">
              User ID
            </h1>
            <h1 className="ad__student__app__section__two__header__status">
              Status
            </h1>
          </div>

          {result.map((item, i) => {
            return (
              <div
                className="ad__student__app__section__two__entry"
                onClick={() => {
                  navigate(`/main/loan-application/${item.id}`);
                }}
              >
                <h1 className="ad__student__app__section__two__entry__date">
                  {item.createdAt}
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

                <h1 className="ad__student__app__section__two__entry__userid">
                  {item.userId}
                </h1>
                <h1 className="ad__student__app__section__two__entry__status">
                  <span>
                    <PiCircleFill
                      className={
                        item.status == "active"
                          ? "ad__student__app__section__two__entry__status__icon successful"
                          : item.status == "inactive"
                          ? "ad__student__app__section__two__entry__status__icon unsuccessful"
                          : "ad__student__app__section__two__entry__status__icon"
                      }
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
