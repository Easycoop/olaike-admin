import "./Admin.societies.css";
import {  useEffect, useState, useRef } from "react";
import { PiCircleFill } from "react-icons/pi";
import Modal from 'react-modal';
import Loading from "../../components/splash/loading/Loading";
import NoResult from "../../components/splash/no-result/NoResult";
import { useNavigate } from "react-router-dom";
import { useGetSocieties, useGetSocietyMembers } from "../../redux/actions/societyAction";
import {useAssignRole} from '../../redux/actions/userAction';
import { BsPen, BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";

function AdminSocieties() {
  const lastTransaction = useRef();
  const getSocieties = useGetSocieties();
  const getSocietyMembers = useGetSocietyMembers();
  const assignRole = useAssignRole();

  const [loading] = useState(false);
  const [result, setResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleGetSocieties = async () => {
    try {
      const response = await getSocieties();

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {

        setResult(response.payload.data.groups);
        return;
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error.response.message);
    } finally {
    }
  };

  const getGroupMembers = async (groupId) =>{
    try {
      const response = await getSocietyMembers(groupId);

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {

        setGroupMembers(response.payload.data);
        return;
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const updateUserRole = async () => {
    try {
      const user_id = selectedUserId;
      const role_name = "Admin";
      const response = await assignRole({user_id, role_name});

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        
        setModalIsOpen(false);
        handleGetSocieties();
        return;
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const adminUsers = (group) => {
    return group?.AdminUsers.filter(user => {
      // Check if the user has a 'Roles' array and if it's not empty
      if (user.Roles && user.Roles.length > 0) {
        // Use the 'some' method to check if at least one role has the name 'Admin'
        return user.Roles.some(role => role.name === "Admin");
      }
      // If no Roles array or it's empty, return false
      return false;
    });
  }

  function openModal(groupId){
    console.log(groupId);
    getGroupMembers(groupId);
    setModalIsOpen(true);
  }

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
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
            <input
              type="text"
              placeholder="Search Societies..."
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input mb-3 form-control"
              style={{ width: "300px" }}
            />
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
            {result.filter((item) => {
                const date = item.createdAt?.toLowerCase() || "";
                const invoice = item.id?.toString().toLowerCase() || "";
                const name = item.name?.toLowerCase() || "";
                const desc = item.description?.toLowerCase() || "";
                const status = item.isActive?.toString().toLowerCase() || "";

                return (
                  date.includes(searchQuery) ||
                  invoice.includes(searchQuery) ||
                  name.includes(searchQuery) ||
                  desc.includes(searchQuery) ||
                  status?.toString().includes(searchQuery)
                );
              })
            .map((item, i) => {
              return (
                <div
                  className="admin__transaction__section__two__entry"
                  useRef={lastTransaction}
                >
                  <h1 className="admin__transaction__section__two__entry__date">
                    {item.createdAt}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__invoice">
                    {item.id}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__ammount">
                    {item.name}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__property">
                    {item.description}
                  </h1>

                  <h1 className="admin__transaction__section__two__entry__userid">
                    <span>
                      <PiCircleFill
                        className={
                          item.status == "true"
                            ? "ad__student__app__section__two__entry__status__icon successsful"
                            : item.status == "false"
                            ? "ad__student__app__section__two__entry__status__icon unsuccesssful"
                            : "ad__student__app__section__two__entry__status__icon"
                        }
                      />
                      {item.status}
                    </span>
                  </h1>
                  <Link
                    className="admin__transaction__section__two__entry__status"
                    to={`/main/societies/${item.id}`}
                  >
                    View
                    <BsEye />
                  </Link>
                  <Link
                    className="admin__transaction__section__two__entry__status"
                    to={`/main/edit-society/${item.id}`}
                  >
                    Edit
                    <BsPen />
                  </Link>
                  {item?.AdminUsers.length == 0 ?
                    <button className="btn btn-primary" onClick={()=>openModal(item.id)}> Add an admin</button>
                    :
                    <button className="btn btn-primary" onClick={()=>openModal(item.id)}> Change Admin</button>
                  }
                  
                </div>
              );
            })}
          </section>
        )}

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={()=>{}}
          onRequestClose={()=>setModalIsOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              minWidth:'35vw',
            },
          }}
          contentLabel="Example Modal"
        >
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <h3 >Attach an admin </h3>
            <button onClick={()=>setModalIsOpen(false)} className="btn-danger btn">close</button>
          </div>
          
          <form>
            <div className="form-group">
              <label>Select an admin</label>
              <select className="form-control" onChange={(e)=>setSelectedUserId(e.target.value)}>
                <option selected disabled>Select a member</option>
                {groupMembers.map((item, i) => (
                  <option value={item.id} key={i}>{item.firstName} {item.lastName}</option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-success" onClick={updateUserRole}>Update</button>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default AdminSocieties;
