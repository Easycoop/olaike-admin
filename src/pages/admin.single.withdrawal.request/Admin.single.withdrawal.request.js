import { useEffect, useState } from "react";
import "./Admin.single.withdrawal.request.css";
import { useNavigate, useParams } from "react-router-dom";
import toastManager from "../../components/ui/toast/ToasterManager";
import {
  useGetSingleRequest,
  useUpdateRequest,
} from "../../redux/actions/withdrawRequestAction";

function SingleWithdrawalRequest() {
  const getSingleRequest = useGetSingleRequest();
  const updateRequest = useUpdateRequest();
  const { requestId } = useParams();
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (param) => {
    setLoading(true);

    const payload = {
      action: param,
      id: result.id,
      amount: result.amount,
      userId: result.userId,
    };
    try {
      const response = await updateRequest(payload);

      if (response?.payload.success === true) {
        setErrorMessage("");
        toastManager.addToast({
          message: "Withdraw request accepted",
          type: "success",
        });
        navigate(-1);
        return;
      } else {
        setErrorMessage(response.message);
        toastManager.addToast({
          message: "Internal server error",
          type: "error",
        });
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleRequest = async () => {
    setLoading(true);
    try {
      const response = await getSingleRequest(requestId);

      if (response?.payload?.data) {
        setErrorMessage("");
        setResult(response.payload.data);
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
    handleGetSingleRequest();
  }, []);

  return (
    <>
      <div className="si__st__app">
        <section className="admin__single__notice__section__one">
          <article className="admin__single__notice__section__one__article1">
            <h1>{`Withdraw request from ${result.userId}`}</h1>
          </article>
          <article className="admin__single__notice__section__one__article2">
            <span>
              <h1>Request Date</h1>
              <h3>{result.createdAt}</h3>
            </span>
            <span>
              <h1>Request Id</h1>
              <h3>{result.id}</h3>
            </span>
            <span>
              <h1>User Id</h1>
              <h3>{result.userId}</h3>
            </span>
            <span>
              <h1>Amount</h1>
              <h3>{result.amount}</h3>
            </span>
            <span>
              <h1>Request reason</h1>
              <h3>{result.reason}</h3>
            </span>
            <span>
              <h1>Status</h1>
              <h3>{result.status}</h3>
            </span>
          </article>
          {result?.status == "pending" && (
            <span className="si__st__app__cta">
              <button
                onClick={() => {
                  submit("accept");
                }}
              >
                Accept
              </button>
              <button
                onClick={() => {
                  submit("reject");
                }}
              >
                Reject
              </button>
            </span>
          )}
        </section>
      </div>
    </>
  );
}

export default SingleWithdrawalRequest;
