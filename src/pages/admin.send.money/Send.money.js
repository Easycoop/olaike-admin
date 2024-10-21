import { BiUser } from "react-icons/bi";
import "./send.money.css";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";

function AdminSendMoney() {
  return (
    <div className="send-money-container">
      <section className="admin__dashboard__section__one">
        <div className="admin__dashboard__section__one__seg">
          <span>
            Total balance
            <BiUser className="admin__dashboard__section__one__seg__icon one" />
          </span>
          <h1>1</h1>
        </div>
        <div className="admin__dashboard__section__one__seg">
          <span>
            Total members balance
            <MdOutlinePendingActions className="admin__dashboard__section__one__seg__icon two" />
          </span>
          <h1>3</h1>
        </div>

        <div className="admin__dashboard__section__one__seg">
          <span>
            Income( fees and dues)
            <IoMdDocument className="admin__dashboard__section__one__seg__icon four" />
          </span>
          <h1>4</h1>
        </div>
      </section>
    </div>
  );
}

export default AdminSendMoney;
