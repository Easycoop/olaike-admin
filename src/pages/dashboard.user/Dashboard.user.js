import "./Dashboard.user.css";
import { BiEdit, BiSearch } from "react-icons/bi";
import { PiCircleFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUsers } from "../../redux/actions/userAction";
import Loading from "../../components/splash/loading/Loading";
import NoResult from "../../components/splash/no-result/NoResult";

function DashboardUser() {
  const getUsers = useGetUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [userResult, setUserResult] = useState([]);

  const handleGetUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response?.payload.success === true) {
        setErrorMessage("");
        setUserResult(response.payload.data.result);
        console.log(response.payload.data.result);
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
    handleGetUsers();
  }, []);

  return (
    <>
      <div className="dashboard__users">
        <section className="dashboard__users__section__one">
          <div className="dashboard__users__search">
            <input placeholder="Enter user name" />
            <BiSearch className="admin__message__section__one__search__icon" />
          </div>
          <h3>Number of users: {userResult.length}</h3>
          <div className="dashboard__users__end">
            <div className="dashboard__users__end__filter">
              <div></div>
            </div>
            <button
              onClick={() => {
                navigate("/main/create-user");
              }}
            >
              Create user
            </button>
          </div>
        </section>
        {loading ? (
          <Loading />
        ) : userResult.length == 0 ? (
          <NoResult
            header="No user application"
            content="There are no user applications"
          />
        ) : (
          <section className="dashboard__users__section__two">
            <div className="dashboard__users__section__two__header">
              <h1 className="dashboard__users__section__two__header__id">ID</h1>
              <h1 className="dashboard__users__section__two__header__name">
                Name
              </h1>
              <h1 className="dashboard__users__section__two__header__email">
                Email
              </h1>
              <h1 className="dashboard__users__section__two__header__role">
                Role
              </h1>
              <h1 className="dashboard__users__section__two__header__status">
                Status
              </h1>
              <h1 className="dashboard__users__section__two__header__created">
                Created
              </h1>
              <h1 className="dashboard__users__section__two__header__action">
                Action
              </h1>
            </div>
            {userResult.map((item, i) => {
              return (
                <div className="dashboard__users__section__two__entry">
                  <h1
                    className="dashboard__users__section__two__entry__id"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    {item.id}
                  </h1>
                  <h1
                    className="dashboard__users__section__two__entry__name"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    {`${item.firstName} ${item.lastName}`}
                  </h1>
                  <h1
                    className="dashboard__users__section__two__entry__email"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    {item.email}
                  </h1>
                  <h1
                    className="dashboard__users__section__two__entry__role"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    {item.role}
                  </h1>
                  <h1
                    className="dashboard__users__section__two__entry__status"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    <span>
                      <PiCircleFill
                        className={
                          item.isVerified
                            ? "ad__student__app__section__two__entry__status__icon successful"
                            : "ad__student__app__section__two__entry__status__icon unsuccessful"
                        }
                      />{" "}
                      {item.isVerified ? "Verified" : "Not verified"}
                    </span>
                  </h1>
                  <h1
                    className="dashboard__users__section__two__entry__created"
                    onClick={() => {
                      navigate(`/main/user/${item.id}`);
                    }}
                  >
                    {item.createdAt}
                  </h1>
                  <h1 className="dashboard__users__section__two__entry__action">
                    <span>
                      <BiEdit
                        className="dashboard__users__section__two__entry__action__icon"
                        onClick={() => navigate("/main/edit-user")}
                      />{" "}
                      <MdDelete
                        className="dashboard__users__section__two__entry__action__icon"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      />
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

export default DashboardUser;
