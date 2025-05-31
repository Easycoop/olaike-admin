import "./Admin.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdGroups, MdOutlinePayment, MdPhonelinkSetup } from "react-icons/md";
import { IoMdClose, IoMdSend, IoMdSettings } from "react-icons/io";
import { BiMenu } from "react-icons/bi";
import {
  FaCreditCard,
  FaMoneyBill,
  FaPowerOff,
  FaUser,
  FaUserPlus,
  FaIdBadge
} from "react-icons/fa";
import { RiDashboardFill, RiMenuFoldFill } from "react-icons/ri";
import logo from "../../assets/icons/logo_text_black.svg";
import DashboardFooter from "../../components/layout/footer/Dashboard.footer";
import DashboardHeader from "../../components/layout/header/Dashboard.header";
import { useSelector } from "react-redux";
import { useLogout } from "../../redux/actions/authActions";
import toastManager from "../../components/ui/toast/ToasterManager";
import { TbArrowBarLeft } from "react-icons/tb";
import { HiMiniTableCells } from "react-icons/hi2";
import { BsNodePlusFill } from "react-icons/bs";
import { LiaHourglassEndSolid } from "react-icons/lia";

function Admin() {
  const { roles, user } = useSelector((state) => state.auth);
  const isSuperAdmin = roles?.includes("SuperAdmin");
  const logout = useLogout();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [active, setActive] = useState(false);
  const [dropdown, setDropdown] = useState({
    create: false,
    applications: false,
  });

  const [path, setPath] = useState("dashboard");
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await logout();
      if (response.status === true || response.status === "success") {
        setErrorMessage("");

        toastManager.addToast({
          message: "Logout successful",
          type: "success",
        });
        navigate("/");
        return;
      } else {
        setErrorMessage(response.message);
        toastManager.addToast({
          message: "Logout unsuccessful",
          type: "error",
        });
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  const [colorId, setColorId] = useState(1);

  return (
    <div className="dashboard">
      <div
        className={active ? "dashboard__navbar active" : "dashboard__navbar"}
      >
        <section className="dashboard__navbar__section__one">
          <img
            src={logo}
            alt=""
            className={
              active
                ? "dashboard__header__logo active"
                : "dashboard__header__logo"
            }
          />
          {!active ? (
            <RiMenuFoldFill
              className={active ? "dashboard__menu active" : "dashboard__menu"}
              onClick={() => setActive(!active)}
            />
          ) : (
            <BiMenu
              className={active ? "dashboard__menu active" : "dashboard__menu"}
              onClick={() => setActive(!active)}
            />
          )}
        </section>
        <section className="dashboard__navbar__section__two">
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Dashboard");
              navigate("/main/dashboard");
              setColorId(1);
            }}
            className={colorId === 1 ? "dashboard__navbar__active" : ""}
          >
            <RiDashboardFill className="dashboard__navbar__icon" />
            <h3>Dashboard</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("User");
              navigate("/main/users");
              setColorId(2);
            }}
            className={colorId === 2 ? "dashboard__navbar__active" : ""}
          >
            <FaUser className="dashboard__navbar__icon" />
            <h3>Users</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("KYC");
              navigate("/main/kyc");
              setColorId(31);
            }}
            className={colorId === 31 ? "dashboard__navbar__active" : ""}
          >
            <FaIdBadge className="dashboard__navbar__icon" />
            <h3>KYC</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Transactions");
              navigate("/main/transaction");
              setColorId(3);
            }}
            className={colorId === 3 ? "dashboard__navbar__active" : ""}
          >
            <MdOutlinePayment className="dashboard__navbar__icon" />
            <h3>Transaction</h3>
          </div>
          {/* {isSuperAdmin && ( */}
            <div
              onClick={() => {
                // setActive(!active);
                setPath("Societies");
                setColorId(123);
                navigate( isSuperAdmin ? "/main/societies" : "/main/edit-society/"+user?.Group?.id);
              }}
              className={colorId === 123 ? "dashboard__navbar__active" : ""}
            >
              <MdGroups className="dashboard__navbar__icon" />
              <h3>Society Management</h3>
            </div>
          {/* )} */}
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Deposit");
              setColorId(143);
              navigate("/main/deposit-money");
            }}
            className={colorId === 143 ? "dashboard__navbar__active" : ""}
          >
            <FaCreditCard className="dashboard__navbar__icon" />
            <h3>Deposit money</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Send money");
              setColorId(108);
              navigate("/main/send-money");
            }}
            className={colorId === 108 ? "dashboard__navbar__active" : ""}
          >
            <IoMdSend className="dashboard__navbar__icon" />
            <h3>Send money</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Create user");
              setColorId(9);
              navigate("/main/create-user");
            }}
            className={colorId === 9 ? "dashboard__navbar__active" : ""}
          >
            <FaUserPlus className="dashboard__navbar__icon" />
            <h3>Create new user</h3>
          </div>
          {isSuperAdmin && (
            <div
              onClick={() => {
                // setActive(!active);
                setPath("Create role");
                setColorId(186);
                navigate("/main/create-role");
              }}
              className={colorId === 186 ? "dashboard__navbar__active" : ""}
            >
              <HiMiniTableCells className="dashboard__navbar__icon" />
              <h3>Create new role</h3>
            </div>
          )}

          {isSuperAdmin && (
            <div
              onClick={() => {
                // setActive(!active);
                setPath("Create Society");
                setColorId(103);
                navigate("/main/create-society");
              }}
              className={colorId === 103 ? "dashboard__navbar__active" : ""}
            >
              <BsNodePlusFill className="dashboard__navbar__icon" />
              <h3>Create new society</h3>
            </div>
          )}
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Withdrawal requests");
              setColorId(39);
              navigate("/main/withdrawal-requests");
            }}
            className={colorId === 39 ? "dashboard__navbar__active" : ""}
          >
            <FaMoneyBill className="dashboard__navbar__icon" />
            <h3>withdrawal requests</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Registration applications");
              setColorId(23);
              navigate("/main/registration-applications");
            }}
            className={colorId === 23 ? "dashboard__navbar__active" : ""}
          >
            <MdPhonelinkSetup className="dashboard__navbar__icon" />
            <h3>Registration applications</h3>
          </div>
          <div
            onClick={() => {
              // setActive(!active);
              setPath("Loan applications");
              setColorId(12);
              navigate("/main/loan-applications");
            }}
            className={colorId === 12 ? "dashboard__navbar__active" : ""}
          >
            <LiaHourglassEndSolid className="dashboard__navbar__icon" />
            <h3>Loan applications</h3>
          </div>
        </section>
        <section className="dashboard__navbar__section__three">
          <div
            onClick={() => {
              // setActive(!active);
              navigate("/main/setting");
              setColorId(16);
            }}
            className={colorId === 16 ? "dashboard__navbar__active" : ""}
          >
            <IoMdSettings className="dashboard__navbar__icon" />
            <h3>Settings</h3>
          </div>
          <div
            onClick={handleLogout}
            className={colorId === 77 ? "dashboard__navbar__active" : ""}
          >
            <FaPowerOff className="dashboard__navbar__icon" />
            <h3>Logout</h3>
          </div>
        </section>
      </div>
      <div>
        <div
          className={active ? "dashboard__outlet active" : "dashboard__outlet"}
        >
          <DashboardHeader path={path} />
          <Outlet />
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}

export default Admin;
