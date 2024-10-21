import "./Admin.societies.css";
import { useContext, useEffect, useState } from "react";
import { PiCircleFill } from "react-icons/pi";
import { useRef } from "react";
import Loading from "../../components/splash/loading/Loading";
import NoResult from "../../components/splash/no-result/NoResult";
import { useNavigate } from "react-router-dom";
import { useGetSocieties } from "../../redux/actions/societyAction";
import { BiPen } from "react-icons/bi";

function AdminSocieties() {
  const lastTransaction = useRef();
  const getSocieties = useGetSocieties();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const handleGetSocieties = async () => {
    try {
      const response = await getSocieties();

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");

        setResult(response.payload.data.groups);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
    }
  };

  useEffect(() => {
    handleGetSocieties();
  }, []);

  return (
    <>
      <div className="admin__transaction">
        <section className="admin__transaction__section__one">
          <span className="admin__transaction__section__header">
            <h1>Registered societies</h1>
            <select name="Timeline" id="Timeline">
              <option value={null}>This month</option>
              <option value="1">Last month</option>
              <option value="2">Last 6 months</option>
              <option value="3">Last 1 year</option>
            </select>
          </span>
        </section>
        {loading ? (
          <Loading />
        ) : result.length == 0 ? (
          <NoResult
            header="No societies"
            content="There are no societies available"
          />
        ) : (
          <section className="admin__transaction__section__two">
            <div className="admin__transaction__section__two__header">
              <h1 className="admin__transaction__section__two__header__date">
                Date created
              </h1>
              <h1 className="admin__transaction__section__two__header__invoice">
                Group ID
              </h1>
              <h1 className="admin__transaction__section__two__header__ammount">
                Name
              </h1>
              <h1 className="admin__transaction__section__two__header__property">
                Description
              </h1>

              <h1 className="admin__transaction__section__two__header__userid">
                Status
              </h1>
              <h1 className="admin__transaction__section__two__header__status">
                Action
              </h1>
            </div>
            {result.map((item, i) => {
              return (
                <div
                  className="admin__transaction__section__two__entry"
                  useRef={lastTransaction}
                >
                  <h1 className="admin__transaction__section__two__entry__date">
                    {result[i].createdAt}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__invoice">
                    {result[i].id}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__ammount">
                    {result[i].name}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__property">
                    {result[i].description}
                  </h1>

                  <h1 className="admin__transaction__section__two__entry__userid">
                    <span>
                      <PiCircleFill
                        className={
                          result[i].isActive == "true"
                            ? "ad__student__app__section__two__entry__status__icon successsful"
                            : result[i].isActive == "false"
                            ? "ad__student__app__section__two__entry__status__icon unsuccesssful"
                            : "ad__student__app__section__two__entry__status__icon"
                        }
                      />
                      {result[i].isActive}
                    </span>
                  </h1>
                  <h1
                    className="admin__transaction__section__two__entry__status"
                    onClick={() => navigate(`/main/edit-society/${item.id}`)}
                  >
                    <BiPen />
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

export default AdminSocieties;
