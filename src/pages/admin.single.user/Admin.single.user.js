import { PiHouseLight } from "react-icons/pi";
import "./Admin.single.user.css";
import { BiCoin } from "react-icons/bi";
import { MdPending } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "../../redux/actions/userAction";
import { useEffect, useState } from "react";
import { useGetWallet } from "../../redux/actions/walletAction";

function AdminSingleUser() {
  const getWallet = useGetWallet();
  const getUser = useGetUser();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [result, setResult] = useState({});
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetUser = async () => {
    setLoading(true);
    try {
      const response = await getUser(userId);
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setResult(response.payload.data.user);
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

  const handleGetWallet = async () => {
    setLoading(true);
    try {
      const response = await getWallet(userId);
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setWallet(response.payload.data.wallet);
        console.log("wallet", response.payload.data.wallet);
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
    handleGetWallet();
    handleGetUser();
  }, []);

  return (
    <>
      <div className="single__user">
        <div className="single__user__section1">
          <h1>User profile info</h1>
          <span>
            <h2>First Name</h2>
            <h3>{result.firstName}</h3>
          </span>
          <span>
            <h2>Last Name</h2>
            <h3>{result.lastName}</h3>
          </span>
          <span>
            <h2>Email</h2>
            <h3>{result.email}</h3>
          </span>
          {/* <span>
            <h2>Country</h2>
            {result.country ? <h3> {result.country}</h3> : <h3>--</h3>}
          </span>
          <span>
            <h2>State of origin</h2>
            {result.state ? <h3> {result.state}</h3> : <h3>--</h3>}
          </span> */}
          <span>
            <h2>Address</h2>
            {result.address ? <h3> {result.address}</h3> : <h3>--</h3>}
          </span>

          <span>
            <h2>Mobile</h2>
            {result.phone ? <h3> {result.phone}</h3> : <h3>--</h3>}
          </span>

          <span>
            <h2>Verification status</h2>
            <h3>
              {result.isVerified ? "Verified" : "Not Verified"} 
            </h3>
          </span>
          <span>
            <h2>Gender</h2>
            {result.gender ? <h3> {result.gender}</h3> : <h3>--</h3>}
          </span>
          <span>
            <h2>User ID</h2>
            <h3>{result.id}</h3>
          </span>
          <span>
            <h2>Wallet ID</h2>
            <h3>{wallet.id}</h3>
          </span>
          <span>
            <h2>Society</h2>
            <h3>
              <a href={`/main/societies/${result.Group?.id}`}>
                {result.Group?.name}
              </a>
            </h3>
          </span>

          <button onClick={() => navigate(`/main/edit-user/${userId}`)}>
            Edit user
          </button>
        </div>
        <div className="single__user__section2">
          <div className="single__user__section2__card">
            <PiHouseLight
              className="single__user__section2__card__icon"
              style={{ color: "black" }}
            />
            <div>
              <h3>Main Wallet</h3>
              <h1>{`${wallet.balance} ${wallet.currency}`}</h1>
            </div>
          </div>

          {/* <div className="single__user__section2__card">
            <BiCoin
              className="single__user__section2__card__icon"
              style={{ color: "gold" }}
            />
            <div>
              <h3>Transaction volume</h3>
              <h1>₦ 320,000</h1>
            </div>
          </div>
          <div className="single__user__section2__card">
            <MdPending
              className="single__user__section2__card__icon"
              style={{ color: "crimson" }}
            />
            <div>
              <h3>Loan balance</h3>
              <h1>₦1,250</h1>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default AdminSingleUser;
