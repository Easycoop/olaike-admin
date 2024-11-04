import { FaFile, FaFileExcel, FaFileImport } from "react-icons/fa";
import "./Admin.withdrawal.requests.css";
import { PiCircleFill } from "react-icons/pi";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/splash/loading/Loading";
import NoResult from "../../components/splash/no-result/NoResult";
import { useGetRequests } from "../../redux/actions/withdrawRequestAction";

function AdminWithdrawalRequest() {
  const getRequests = useGetRequests();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const handleGetRequests = async () => {
    setLoading(true);
    try {
      const response = await getRequests();
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
    handleGetRequests();
  }, []);

  return (
    <>
      <div className="ad__student__app">
        <section className="ad__student__app__section__one">
          <span className="ad__student__app__section__header">
            <h1>Registration application summary</h1>
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
                <h3>Total requests</h3>
                <h1>{result.length}</h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileCircleCheck className="ad__student__app__section__one__card__icon two" />
              <div>
                <h3>Successful requests</h3>
                <h1>
                  {
                    result.filter(function (item, i) {
                      if (result[i].status == "successful") {
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
                <h3>Pending requests</h3>
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
                <h3>Unsuccessful requests</h3>
                <h1>
                  {
                    result.filter(function (item, i) {
                      if (result[i].status == "unsuccessful") {
                        return result[i];
                      }
                    }).length
                  }
                </h1>
              </div>
            </div>
          </article>
        </section>
        {loading ? (
          <Loading />
        ) : result.length == 0 ? (
          <NoResult
            header="No withdrawal requests"
            content="There are no withdrawal requests"
          />
        ) : (
          <section className="ad__student__app__section__two">
            <div className="ad__student__app__section__two__header">
              <h1 className="ad__student__app__section__two__header__date">
                Request date
              </h1>
              <h1 className="ad__student__app__section__two__header__id">
                Request ID
              </h1>
              <h1 className="ad__student__app__section__two__header__university">
                User ID
              </h1>
              <h1 className="ad__student__app__section__two__header__universityemail">
                Request reason
              </h1>

              <h1 className="ad__student__app__section__two__header__userid">
                Amount
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
                    navigate(`/main/withdrawal-request/${result[i].id}`);
                  }}
                >
                  <h1 className="ad__student__app__section__two__entry__date">
                    {result[i].createdAt}
                  </h1>
                  <h1 className="ad__student__app__section__two__entry__id">
                    {result[i].id}
                  </h1>
                  <h1 className="ad__student__app__section__two__entry__university">
                    {item.userId}
                  </h1>
                  <h1 className="ad__student__app__section__two__entry__universityemail">
                    {result[i].reason}
                  </h1>

                  <h1 className="ad__student__app__section__two__entry__userid">
                    {result[i].amount}
                  </h1>
                  <h1 className="ad__student__app__section__two__entry__status">
                    <span>
                      <PiCircleFill
                        className={
                          result[i].status == "successful"
                            ? "ad__student__app__section__two__entry__status__icon successful"
                            : result[i].status == "unsuccessful"
                            ? "ad__student__app__section__two__entry__status__icon unsuccessful"
                            : "ad__student__app__section__two__entry__status__icon"
                        }
                      />{" "}
                      {result[i].status}
                    </span>
                  </h1>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </>
  );
}

export default AdminWithdrawalRequest;
