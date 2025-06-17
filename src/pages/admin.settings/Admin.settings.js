import "./Admin.settings.css";
import { BsAsterisk } from "react-icons/bs";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useClearDB} from '../../redux/actions/miscAction';
import toastManager from "../../components/ui/toast/ToasterManager";
import { useGetUser, useUpdateUser } from "../../redux/actions/userAction";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import Theme from "./Theme";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";


function AdminSettings() {
  
  const { user, roles } = useSelector((state) => state.auth);
  const isSuperAdmin = roles?.includes("SuperAdmin");
  const navigate = useNavigate();
  const clearDB = useClearDB();
  const getUser = useGetUser();
  const updateUser = useUpdateUser();

  const handleClearDB = async () => {
    try {
      const response = await clearDB();

        if (
          response?.payload.status === 200 ||
          response?.payload.status === "success"
        ) {
          toastManager.addToast({
            message: "Database cleared",
            type: "success",
          });
          
          return;
        } else {
          console.log(response);
          
          toastManager.addToast({
            message: "Something went wrong",
            type: "error",
          });
        }
    } catch (error) {
      console.log(error);
      toastManager.addToast({
          message: "Something went wrong",
          type: "error",
        });
    }
    
  }

  const [select, setSelect] = useState({
    select1: true,
    select2: false,
    select3: false,
  });

  const [errorMessage, setErrorMessage] = useState();
  const [validationErrors, setValidationErrors] = useState();

  const [userData, setUserData] = useState({
    id:user.id,
    firstName:user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    country: user.country,
    state: user.state,
    gender: user.gender,
    phone: user.phone,
  });

  const [nationality, setNationality] = useState()

  const handleGetUser = async () => {
    try {
      const response = await getUser(user?.id);
      if (response?.payload.success === true || response?.payload.status === "success") {
        const compUserData = response.payload.data.user;
        for (let prop in compUserData){
          if(!prop in userData){
            delete compUserData[prop]
          }
        }
        setUserData(compUserData);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message); 
    }
    
  }

  const handleUpdateUser = async () => {
    try {
      const response = await updateUser(userData);
      if (response?.payload.success === true || response?.payload.status === "success") {
        toastManager.addToast({
          message: "Updated successfully",
          type: "success",
        });
      }else{
        toastManager.addToast({
          message: response.payload.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      
      toastManager.addToast({
          message: "S",
          type: "error",
        });
    }
    
  };

  const updateUserDataState = (prop, value) => {
    setUserData((prevState) => ({ ...prevState, [prop]: value }));
  };


   const validateUpdateForm = async () => {
      
      const validate = await runValidation([
          {
            input: { value: userData.address, field: "address", type: "text" },
            rules: { required: true },
          },
          {
              input: { value: userData.email, field: "email", type: "text" },
              rules: { required: true, email:true },
          },
          {
              input: { value: userData.phone, field: "phone", type: "text" },
              rules: { required: true, min_length:13, max_length:13 },
          },
          {
              input: { value: userData.firstName, field: "first_name", type: "text" },
              rules: { required: true, },
          },
          {
              input: { value: userData.lastName, field: "last_name", type: "text" },
              rules: { required: true, },
          },
          {
              input: { value: userData.gender, field: "gender", type: "text" },
              rules: { required: true, },
          },
          
      ]);
  
      if (validate?.status === false) {
          
          setValidationErrors(validate.errors);
      } else {
        // alert("kkkkkk")
        handleUpdateUser();
      }
    }

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <>
      <div className="admin__settings">
        <section className="account__notifications__section__two">
          <div className="account__notifications__select__div flex justify-between">
            <div>
              <button
                className={
                  select.select1
                    ? "account__notifications__select selected"
                    : "account__notifications__select"
                }
                onClick={() =>
                  setSelect((prevState) => ({
                    ...prevState,
                    select1: true,
                    select2: false,
                    select3: false,
                  }))
                }
              >
                Account
              </button>
              <button
                className={
                  select.select2
                    ? "account__notifications__select selected"
                    : "account__notifications__select"
                }
                onClick={() =>
                  setSelect((prevState) => ({
                    ...prevState,
                    select1: false,
                    select2: true,
                    select3: false,
                  }))
                }
              >
                Theme
              </button>
            </div>
              
            {
              isSuperAdmin && <button onClick={handleClearDB}>Clear Database </button>
            }
            

          </div>
        </section>

        <section>
          {select.select1 ? (
            <div className="edit__user">
              <h1>Account details</h1>
              <section className="edit__user__section1">
                <h3>Edit your account details</h3>
                <article>
                  <div className="edit__user__article__div">
                    <label>
                      First Name{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <input
                      type="text"
                      alt=""
                      defaultValue={userData.firstName}
                      onChange={(e) => updateUserDataState("firstName", e.target.value)}
                    />
                    <ValidationError validationErrors={validationErrors} field="first_name" />
                  </div>
                  <div className="edit__user__article__div">
                    <label>
                      Last Name{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <input
                      type="text"
                      alt=""
                      defaultValue={userData.lastName}
                      onChange={(e) => updateUserDataState("lastName", e.target.value)}
                    />
                    <ValidationError validationErrors={validationErrors} field="last_name" />
                  </div>
                  <div className="edit__user__article__div">
                    <label>
                      Email{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <input
                      type="email"
                      alt=""
                      defaultValue={userData.email}
                      onChange={(e) => updateUserDataState('email', e.target.value)}
                    />
                    <ValidationError validationErrors={validationErrors} field="email" />
                  </div>

                  <div className="edit__user__article__div">
                    <label>
                      Country{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <CountryDropdown
                      whitelist={["NG", "SL"]}
                      value={userData?.country}
                      onChange={(val, e) => {updateUserDataState('country', e.target.value); setNationality(val)}}
                    />
                    <ValidationError validationErrors={validationErrors} field="country" />
                  </div>
                  <div className="edit__user__article__div">
                    <label>State/Region</label>
                    <RegionDropdown
                      country={nationality}
                      value={userData.state}
                      blankOptionLabel="State"
                      onChange={(val, e) => updateUserDataState('state', e.target.value)}
                    />
                    <ValidationError validationErrors={validationErrors} field="state" />
                  </div>

                  <div className="edit__user__article__div">
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="e.g Lekki, Rosario"
                      alt=""
                      defaultValue={userData.address}
                      onChange={(e) => updateUserDataState('address', e.target.value)}
                      name="address"
                    />
                    <ValidationError validationErrors={validationErrors} field="address" />
                  </div>

                  <div className="edit__user__article__div">
                    <label>
                      Gender{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <select  id="gender" defaultValue={userData.gender} onChange={(e) => {updateUserDataState('gender', e.target.value)}}>
                      <option value={null}>--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ValidationError validationErrors={validationErrors} field="gender" />
                  </div>
                  {/* <div className="edit__user__article__div">
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
                  </div> */}
                  <div className="edit__user__article__div">
                    
                    <PhoneInput
                      country={"ng"}
                      onChange={(val) => updateUserDataState('phone', val)}
                      inputStyle={{
                        width: "100%",
                        margin: "0",
                      }}
                      containerStyle={{
                        marginBottom: "20px",
                      }}
                      value={userData.phone}
                    />
                    <ValidationError validationErrors={validationErrors} field="phone" />
                  </div>
                  

                  {/* <div className="edit__user__article__div">
                    <label>
                      Profile image{" "}
                      <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
                    </label>
                    <form
                      className="image__upload"
                      onClick={() =>
                        document.querySelector(".input__field").click()
                      }
                    >
                      <input
                        type="file"
                        accept="image/*"
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
                        <img
                          src={image}
                          width={75}
                          height={75}
                          alt={fileName}
                        />
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
                <button onClick={validateUpdateForm}>Save</button>
                <button
                  onClick={() => {
                    navigate("/admin/user");
                  }}
                >
                  Cancel
                </button>
              </span>
            </div>
          ) : (
            <></>
          )}

          {select.select2 ? (
           <Theme />
          ) : (
            <></>
          )}
        </section>
      </div>
    </>
  );
}

export default AdminSettings;
