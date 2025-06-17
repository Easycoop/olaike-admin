import "./Dashboard.user.css";
import { BiEdit, BiSearch } from "react-icons/bi";
import { PiCircleFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUsers } from "../../redux/actions/userAction";
import Loading from "../../components/splash/loading/Loading";
import NoResult from "../../components/splash/no-result/NoResult";
import {ngDateFormat} from '../../utils/time';

function DashboardUser() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userResult, setUserResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const getUsers = useGetUsers();

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleGetUsers = async (page) => {
    setLoading(true);
    try {
      if (page > totalPages) return;
      // const size = totalItems = 0 ? 20 : ((totalItems - (size * page)) < 20 ? (totalItems - (size * page)) : 20);
      // console.log("size", size);
      
      const response = await getUsers(page);  
      
      if (response?.payload.success === true) {
        setErrorMessage("");
        setUserResult(response.payload.data.result);
        setCurrentPage(response.payload.data.currentPage);
        setTotalPages(response.payload.data.totalPages);
        setTotalItems(response.payload.data.totalItems);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUsers(1);
  }, []);


  return (
    <>
      <div className="dashboard__users">
        <section className="dashboard__users__section__one">
          <div className="dashboard__users__search">
            <input
               type="text"
               placeholder="Search users..."
               onChange={(e) => handleSearch(e.target.value)}
               className="search-input"
            />
            <BiSearch className="admin__message__section__one__search__icon" />
          </div>
          <h3>Number of users: {totalItems}</h3>
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
          <h1 className="dashboard__users__section__two__header__name">
                Name
              </h1>
              <h1 className="dashboard__users__section__two__header__email">
                Email
              </h1>
              <h1 className="dashboard__users__section__two__header__id">Society</h1>
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
    
          {userResult
            .filter((item) => {
              const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
              const email = item.email?.toLowerCase() || "";
              const groupName = item.Group?.name?.toLowerCase() || "";
              const role = item.role?.toLowerCase() || "";
              const status = item.kycStatus === 'verified' ? "verified" : "not verified";
    
              return (
                fullName.includes(searchQuery) ||
                email.includes(searchQuery) ||
                groupName.includes(searchQuery) ||
                role.includes(searchQuery) ||
                status.includes(searchQuery)
              );
            })
            .map((item) => (
              <div className="dashboard__users__section__two__entry" key={item.id}>
                
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
                  className="dashboard__users__section__two__entry__id"
                  
                >
                  {item?.Group?.name}
                </h1>
                <h1
                  className="dashboard__users__section__two__entry__role"
                  onClick={() => {
                    navigate(`/main/user/${item.id}`);
                  }}
                >
                  {item.Roles && item.Roles[0].name}
                </h1>
                <h1
                    className="dashboard__users__section__two__entry__status"
                    onClick={() => 
                      navigate(`/main/user/${item.id}`)
                    }
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
                   
                  >
                    {ngDateFormat(item.createdAt)}
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
            ))}


            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => handleGetUsers(currentPage - 1)}
              >
                Previous
              </button>

              <span>Page {currentPage} of {totalPages}</span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  if (currentPage < totalPages) handleGetUsers(currentPage + 1);
                }}
              >
                Next
              </button>
            </div>
        </section>
          
        )}
      </div>
    </>
  );
}

export default DashboardUser;
