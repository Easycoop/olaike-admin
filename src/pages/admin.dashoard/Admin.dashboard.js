import { BiUser } from "react-icons/bi";
import "./Admin.dashboard.css";
import { MdOutlinePayment, MdOutlinePendingActions } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { RiAsterisk } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import StateContext from "../../context/StateProvider";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { PiCircleFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useGetApplications } from "../../redux/actions/applicationAction";
import { useGetDashboardData } from "../../redux/actions/miscAction";
import {ngDateFormat} from '../../utils/time';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const getApplications = useGetApplications();
  const getDashboardData = useGetDashboardData();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const totalResult = 2;
  const totalUsers = 5;

  const handleGetApplications = async () => {
    setLoading(true);
    try {
      const response = await getApplications();
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

  const handleGetDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboardData();
      if (response?.payload.success === true) {
        setErrorMessage("");
        setData(response.payload.data);
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
    handleGetApplications();
    handleGetDashboardData();
  }, []);

  return (
    <>
      <div className="admin__dashboard">
        <section className="admin__dashboard__section__one">
          <div className="admin__dashboard__section__one__seg">
            <span>
              Total no. of users{" "}
              <BiUser className="admin__dashboard__section__one__seg__icon one" />
            </span>
            <h1>{data?.totalUsers}</h1>
          </div>
          <div className="admin__dashboard__section__one__seg">
            <span>
              Pending registration applications
              <MdOutlinePendingActions className="admin__dashboard__section__one__seg__icon two" />
            </span>
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

          <div className="admin__dashboard__section__one__seg">
            <span>
              Pending loan applications{" "}
              <IoMdDocument className="admin__dashboard__section__one__seg__icon four" />
            </span>
            <h1>{data?.pendingApplications}</h1>
          </div>
          <div className="admin__dashboard__section__one__seg">
            <span>
              Gross transaction volume{" "}
              <MdOutlinePayment className="admin__dashboard__section__one__seg__icon three" />
            </span>
            <h1>{data?.transactionVolume}</h1>
          </div>
        </section>
         {/*<section className="admin__dashboard__section__two">
          <div className="admin__dashboard__section__two__seg1">
            <p>{`User Id: ${user.id}`}</p>
            <p>{`Name: ${user.firstName} ${user.lastName}`}</p>
            <p>{`Wallet Id: ${user.walletId}`}</p> 
          </div>
          <div className="admin__dashboard__section__two__seg2">
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="100%"
            />
          </div>
          <div className="admin__dashboard__section__two__seg3">
            <Chart
              options={chart.options}
              series={chart.series}
              type="scatter"
              width="100%"
            />
          </div> 
        </section>*/}
        <section className="admin__dashboard__section__three">
          <div
            className="admin__dashboard__section__three__seg2"
            style={{ width: "100%" }}
          >
            <h1>Registration applications</h1>
            <div className="admin__dashboard__section__three__seg2__header">
              <h1 className="admin__dashboard__section__three__seg2__header__id">
                Date
              </h1>
              {/* <h1 className="admin__dashboard__section__three__seg2__header__title">
                Application number
              </h1> */}
              <h1 className="admin__dashboard__section__three__seg2__header__views">
                Name
              </h1>
              <h1 className="admin__dashboard__section__three__seg2__header__propertytype">
                Email
              </h1>
              <h1 className="admin__dashboard__section__three__seg2__header__views">
                Society
              </h1>
              <h1 className="admin__dashboard__section__three__seg2__header__userid">
                Role
              </h1>
              <h1 className="admin__dashboard__section__three__seg2__header__ranking">
                Status
              </h1>
            </div>
            {result.map((item, i) => {
              return (
                <div
                  className="admin__dashboard__section__three__seg2__entry"
                  onClick={() => {
                    navigate(`/main/registration-application/${result[i].id}`);
                  }}
                >
                  <h1 className="admin__dashboard__section__three__seg2__entry__id">
                    {ngDateFormat(result[i].createdAt)} 
                    {/* {result[i].createdAt} */}
                  </h1>
                  <h1 className="admin__dashboard__section__three__seg2__entry__views">
                    {`${result[i].firstName} ${result[i].lastName}`}
                  </h1>

                  <h1 className="admin__dashboard__section__three__seg2__entry__propertytype">
                    {result[i].email}
                  </h1>
                  <h1 className="admin__dashboard__section__three__seg2__entry__views">
                    {result[i]?.Group?.name}
                  </h1>
                  <h1 className="admin__dashboard__section__three__seg2__entry__userid">
                    EndUser
                  </h1>
                  <h1 className="admin__dashboard__section__three__seg2__entry__ranking">
                    <span>
                      <PiCircleFill
                        className={
                          result[i].status == "success"
                            ? "ad__student__app__section__two__entry__status__icon successful"
                            : result[i].status == "failed"
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
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;
