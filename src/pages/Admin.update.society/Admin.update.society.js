import "./Admin.update.society.css";
import { useEffect, useState } from "react";
import { BsAsterisk } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSociety,
  useUpdateSociety,
} from "../../redux/actions/societyAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";
import Loading from "../../components/splash/loading/Loading";
import {runValidation} from '../../utils/buchi';
import ValidationError from '../../components/ui/form-elements/ValidaionError';

function AdminUpdateSociety() {
  const getSociety = useGetSociety();
  const updateSociety = useUpdateSociety();
  const { societyId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [validationErrors, setValidationErrors] = useState();

  const handleUpdateSociety = async () => {
    // if (!name || !description || entranceFee) {
    //   setErrorMessage("Name or description cannot be empty");
    //   return;
    // }

    setLoading(true);

    try {
      const response = await updateSociety({
        name,
        description,
        entranceFee,
        isActive,
        societyId
      });
      // console.log(response);
      
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName("");
        setDescription("");
        setEntranceFee("");
        setIsActive(true);
        toastManager.addToast({
          message: "Society created successfully",
          type: "success",
        });
        navigate(-1);
        return;
      } else {
        setErrorMessage(response?.message);
      }
    } catch (error) {
      setErrorMessage(error?.response?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSociety = async () => {
    setLoadingInit(true);

    try {
      const response = await getSociety(societyId);
      // console.log(response);
      
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName(response.payload.data.name);
        setDescription(response.payload.data.description);
        setEntranceFee(response.payload.data.entranceFee);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoadingInit(false);
    }
  };

  const validateUpdateForm = async () => {
    
    const validate = await runValidation([
        {
          input: { value: entranceFee, field: "entrance_fee", type: "number" },
          rules: { required: true },
        },
        {
            input: { value: name, field: "name", type: "text" },
            rules: { required: true },
        },
        {
            input: { value: description, field: "description", type: "text" },
            rules: { required: true, min_length:20, },
        },
        
    ]);

    if (validate?.status === false) {
        
        setValidationErrors(validate.errors);
    } else {
      // alert("kkkkkk")
      handleUpdateSociety();
    }
  }

  useEffect(() => {
    handleGetSociety();
  }, []);
  

  return (
    <>
      {loadingInit ? (
        <Loading />
      ) : (
        <div className="create__society">
          <h1>Edit society</h1>
          <section className="edit__user__section1 create__society__wrap">
            <article
              style={{
                justifyContent: "start",
                gap: "20px",
              }}
            >
              <div className="edit__user__article__div">
                <label>
                  Name
                  {/* <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk> */}
                </label>
                <input
                  required
                  type="text"
                  alt=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <ValidationError validationErrors={validationErrors} field='name' />
              </div>

              <div className="edit__user__article__div">
                <label>
                  Description
                  {/* <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk> */}
                </label>
                <input
                  required
                  type="text"
                  value={description}
                  alt=""
                  onChange={(e) => setDescription(e.target.value)}
                />
                <ValidationError validationErrors={validationErrors} field='description' />
              </div>
              <div className="edit__user__article__div">
                <label>
                  Entrance Fee
                  {/* <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk> */}
                </label>
                <input
                  required
                  type="number"
                  value={entranceFee}
                  alt=""
                  onChange={(e) => setEntranceFee(e.target.value)}
                />
                <ValidationError validationErrors={validationErrors} field='entrance_fee' />
              </div>
              <div className="edit__user__article__div">
                <label>
                  Is active
                  {/* <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk> */}
                </label>
                <select
                  required
                  value={isActive}
                  alt=""
                  onChange={(e) => setIsActive(e.target.value)}
                >
                  <option value={null}>--</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </article>
          </section>

          <span>
            <button disabled={loading} onClick={validateUpdateForm}>
              {loading ? <ClipLoader color="#fff" size={20} /> : "Edit society"}
            </button>
          </span>
        </div>
      )}
    </>
  );
}

export default AdminUpdateSociety;
