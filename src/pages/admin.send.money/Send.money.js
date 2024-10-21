import { BiUser } from "react-icons/bi";
import "./send.money.css";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import image1 from "../../assets/images/rb_24175.png";
import image2 from "../../assets/images/rb_24185.png";

function AdminSendMoney() {
  return (
    <div className="send__money">
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
            Income (fees and dues)
            <IoMdDocument className="admin__dashboard__section__one__seg__icon four" />
          </span>
          <h1>4</h1>
        </div>
        <div className="admin__dashboard__section__one__seg">
          <span>
            Deficit ( Total balance - Total members balance)
            <IoMdDocument className="admin__dashboard__section__one__seg__icon four" />
          </span>
          <h1>4</h1>
        </div>
      </section>

      <section className="send__money__section__two">
        <div className="send__money__section__two__block">
          <div>
            <h5>Transfer</h5>
            <p>Send money to member wallet</p>
          </div>
          <img src={image1} />
        </div>
        <div className="send__money__section__two__block">
          <div>
            <h5>Withdraw</h5>
            <p>Send money to bank account</p>
          </div>
          <img src={image2} />
        </div>
      </section>
    </div>
  );
}

export default AdminSendMoney;
