import "./Admin.create.user.css";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import { BsAsterisk } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { useGetRoles } from "../../redux/actions/roleAction";
import { ClipLoader } from "react-spinners";
import toastManager from "../../components/ui/toast/ToasterManager";
import { useCreateUsers } from "../../redux/actions/userAction";
import { useGetSocieties } from "../../redux/actions/societyAction";
import { useSelector } from "react-redux";

function AdminCreateUser() {
  const auth = useSelector((state) => state.auth);
  const isSuperAdmin = auth.roles?.includes("SuperAdmin");
  const getRoles = useGetRoles();
  const getSocieties = useGetSocieties();
  const createUser = useCreateUsers();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [societies, setSocieties] = useState([]);

  const navigate = useNavigate();

  const [group, setGroup] = useState(auth.user.groupId);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [verification, setVerification] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("lastName", lastName);
    formData.append("firstName", firstName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("country", nationality);
    formData.append("state", state);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("group", group);
    formData.append("isVerified", verification);

    try {
      setLoading(true);
      console.log("form data ", formData);
      const response = await createUser(formData);

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setLastName("");
        setFirstName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setGender("");
        setNationality("");
        setState("");
        setAddress("");
        setRole(null);
        setVerification(null);
        setGroup(null);

        toastManager.addToast({
          message: "User created successfully",
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

  const handleGetSocieties = async () => {
    try {
      const response = await getSocieties();
      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setSocieties(response.payload.data.groups);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
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

  useEffect(() => {
    handleGetRoles();
    handleGetSocieties();
  }, []);

  return (
    <>
      <div className="create__user">
        <h1>Create new user</h1>
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
                value={firstName}
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
                value={lastName}
                alt=""
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
                value={email}
                alt=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="edit__user__article__div">
              <label>
                Country{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <CountryDropdown
                // whitelist={["NG", "SL"]}
                value={nationality}
                onChange={(val) => setNationality(val)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>State/Region</label>
              <RegionDropdown
                country={nationality}
                value={state}
                blankOptionLabel="State"
                onChange={(val) => setState(val)}
              />
            </div>

            <div className="edit__user__article__div">
              <label>Address</label>
              <input
                type="text"
                value={address}
                placeholder="e.g Lekki, Rosario"
                alt=""
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
                value={gender}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSuperAdmin && (
              <div className="edit__user__article__div">
                <label>
                  Society{" "}
                  <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                </label>
                <select
                  name="societies"
                  id="societies"
                  alt=""
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value={null}>--</option>
                  {societies.map((societies) => (
                    <option key={societies.id} value={societies.id}>
                      {societies.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              <label>Phone</label>
              <input
                type="phone"
                placeholder="e.g +2347011122233"
                alt=""
                value={phone}
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {/* <div className="edit__user__article__div">
              <label>
                Phone{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <PhoneInput
                country={"ng"}
                onChange={(e) => setPhone(e)}
                inputStyle={{
                  width: "100%",
                  height: "30px",
                  margin: "0",
                }}
                containerStyle={{
                  marginBottom: "20px",
                }}
              />
            </div> */}
            <div className="edit__user__article__div">
              <label>
                Verify email{" "}
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <select
                name="verification"
                id="verification"
                alt=""
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
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
          <button onClick={handleCreateUser} disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={20} /> : "Create user "}
          </button>
        </span>
      </div>
    </>
  );
}

export default AdminCreateUser;
