import "./Admin.create.role.css";
import { useState } from "react";
import { BsAsterisk } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useCreateSociety } from "../../redux/actions/societyAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";
import { useCreateRole } from "../../redux/actions/roleAction";

function AdminCreateRole() {
  const createRole = useCreateRole();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");

  const handleCreateRole = async () => {
    if (!name) {
      setErrorMessage("Name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await createRole(name);
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName("");
        toastManager.addToast({
          message: "Role created successfully",
          type: "success",
        });
        return;
      } else {
        setErrorMessage(response.payload.message);
      }
    } catch (error) {
      console.log("smmy", error);
      setErrorMessage(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create__society">
        <h1>Create new role</h1>
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
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                required
                type="text"
                alt=""
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errorMessage && <p className="error__message">{errorMessage}</p>}
            </div>
          </article>
        </section>

        <span>
          <button disabled={loading} onClick={handleCreateRole}>
            {loading ? <ClipLoader color="#fff" size={20} /> : "Create role"}
          </button>
        </span>
      </div>
    </>
  );
}

export default AdminCreateRole;
