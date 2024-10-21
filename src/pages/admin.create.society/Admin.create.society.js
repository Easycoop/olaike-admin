import "./Admin.create.society.css";
import { useState } from "react";
import { BsAsterisk } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useCreateSociety } from "../../redux/actions/societyAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";

function AdminCreateSociety() {
  const createSociety = useCreateSociety();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entranceFee, setEntranceFee] = useState("");

  const handleCreateSociety = async () => {
    if (!name || !description) {
      setErrorMessage("Name or description cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await createSociety({
        name,
        description,
        entranceFee,
      });
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName("");
        setDescription("");
        setEntranceFee("");
        toastManager.addToast({
          message: "Society created successfully",
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

  return (
    <>
      <div className="create__society">
        <h1>Create new society</h1>
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

            <div className="edit__user__article__div">
              <label>
                Description
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                required
                type="text"
                value={description}
                alt=""
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="edit__user__article__div">
              <label>
                Entrance Fee
                <BsAsterisk className="edit__user__article__div__icon"></BsAsterisk>
              </label>
              <input
                required
                type="number"
                value={entranceFee}
                alt=""
                onChange={(e) => setEntranceFee(e.target.value)}
              />
            </div>
          </article>
        </section>

        <span>
          <button disabled={loading} onClick={handleCreateSociety}>
            {loading ? <ClipLoader color="#fff" size={20} /> : "Create society"}
          </button>
        </span>
      </div>
    </>
  );
}

export default AdminCreateSociety;
