import "./Admin.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
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
import DashboardFooter from "../../components/layout/footer/Dashboard.footer";
import DashboardHeader from "../../components/layout/header/Dashboard.header";
import { useSelector } from "react-redux";
import { useLogout } from "../../redux/actions/authActions";
import toastManager from "../../components/ui/toast/ToasterManager";
import { TbArrowBarLeft } from "react-icons/tb";
import { HiMiniTableCells } from "react-icons/hi2";
import { BsNodePlusFill } from "react-icons/bs";
import { LiaHourglassEndSolid } from "react-icons/lia";
import {ConfigContext} from "../../context/ConfigProvider";
import SidebarMenuItem from "./SidebarMenuItem";
import { sidebarMenu } from "./sidebar_menus"; 

function Admin() {
  const { roles, user } = useSelector((state) => state.auth);
  const isSuperAdmin = roles?.includes("SuperAdmin");
  const logout = useLogout();
  const navigate = useNavigate();

  const {config} = useContext(ConfigContext);

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
            src={config?.logos?.text_logo_black}
            style={{width: "100px"}}
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
          {sidebarMenu(isSuperAdmin, user).map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              activeColorId={colorId}
              setColorId={setColorId}
            />
          ))}
          <div
            onClick={handleLogout}
            className={colorId === 77 ? "dashboard__navbar__active sidebar__menu__item" : "sidebar__menu__item"}
          >
            <FaPowerOff className="dashboard__navbar__icon text-red-500" />
            <h3 className="text-red-500">Logout</h3>
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
