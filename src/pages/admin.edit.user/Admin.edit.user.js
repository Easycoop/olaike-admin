import { useEffect, useState } from "react";
import "./Admin.edit.user.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import { BsAsterisk } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { useGetUser, useUpdateUser } from "../../redux/actions/userAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { useGetRoles } from "../../redux/actions/roleAction";
import { ClipLoader } from "react-spinners";

function AdminEditUser() {
  const updateUser = useUpdateUser();
  const getRoles = useGetRoles();
  const getUser = useGetUser();
  const { userId } = useParams();
  const [result, setResult] = useState({});
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  const [lastName, setLastName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [gender, setGender] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [address, setAddress] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(null);

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const response = await updateUser({
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: password,
        phone: phone,
        gender: gender,
        country: country,
        state: state,
        address: address,
        role: role,
        isVerified: isVerified,
        id: userId,
      });

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        navigate(-1);
        toastManager.addToast({
          message: "User edited successfully",
          type: "success",
        });
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

  const handleGetRoles = async () => {
    try {
      const response = await getRoles();

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setRoles(response.payload.data.roles);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
    }
  };

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

  useEffect(() => {
    handleGetRoles();
    handleGetUser();
  }, []);

  return (
    <>
      <div className="edit__user">
        <h1>Accout details</h1>
        <section className="edit__user__section1">
          <h3>Personal details</h3>
          <article>
            <div className="edit__user__article__div">
              <label>
                First Name{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                type="text"
                alt=""
                defaultValue={result.firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>
                Last Name{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                type="text"
                alt=""
                defaultValue={result.lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>
                Email{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                type="email"
                alt=""
                defaultValue={result.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="edit__user__article__div">
              <label>
                Country{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <CountryDropdown
                value={country}
                onChange={(val) => setCountry(val)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>State/Region</label>
              <RegionDropdown
                country={country}
                value={state}
                blankOptionLabel="State"
                onChange={(val) => setState(val)}
              />
            </div>

            <div className="edit__user__article__div">
              <label>Address</label>
              <input
                type="text"
                placeholder="e.g Lekki, Rosario"
                alt=""
                defaultValue={result.address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>
                Gender{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <select
                name="gender"
                id="gender"
                defaultValue={result.gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={null}>--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="edit__user__article__div">
              <label>
                Password{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                type="password"
                placeholder="Password must contain and upper case, lowercase and special character"
                alt=""
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="edit__user__article__div">
              <label>Phone</label>
              <input
                type="phone"
                placeholder="e.g +2347011122233"
                alt=""
                defaultValue={result.phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>
                Role{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <select
                name="role"
                id="role"
                alt=""
                // value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value={null}>--</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit__user__article__div">
              <label>
                Verify email{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <select
                name="isVerified"
                id="isVerified"
                alt=""
                defaultValue={result.isVerified}
                onChange={(e) => setIsVerified(e.target.value)}
              >
                <option value={null}>--</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
            {/* <div className="edit__user__article__div">
              <label>
                Profile image{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <form
                className="image__upload"
                onClick={() => document.querySelector(".input__field").click()}
              >
                <input
                  type="file"
                  className="input__field"
                  hidden
                  onChange={({ target: { files } }) => {
                    files[0] && setFileName(files[0].name);
                    if (files) {
                      const reader = new FileReader();
                      reader.readAsDataURL(files[0]);
                      reader.onloadend = () => {
                        setImage(reader.result);
                      };
                    }
                  }}
                />

                {image ? (
                  <img src={image} width={75} height={75} alt={fileName} />
                ) : (
                  <MdCloudUpload color="#1475cf" size={50} />
                )}
              </form>
              <div className="image__upload__label">
                <AiFillFileImage color="#1475" />
                <span>
                  {fileName}
                  <MdDelete
                    onClick={() => {
                      setFileName("No file selected");
                      setImage(null);
                    }}
                  />
                </span>
              </div>
            </div> */}
          </article>
        </section>

        <span>
          <button onClick={handleUpdateUser} disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={20} /> : "Save "}
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </span>
      </div>
    </>
  );
}

export default AdminEditUser;
