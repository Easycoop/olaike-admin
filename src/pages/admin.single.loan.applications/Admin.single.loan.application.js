import { useEffect, useState } from "react";
import "./Admin.single.loan.application.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleLoanApplication,
  useUpdateLoanApplication,
} from "../../redux/actions/applicationAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import LoanDetail from "../admin.loan.applications/admin.loan.detail";
import { ngDateFormat, ngDateTimeFormat } from "../../utils/time";

function SingleLoanApplications() {
  const getSingleLoanApplication = useGetSingleLoanApplication();
  const updateLoanApplication = useUpdateLoanApplication();

  const { applicationId } = useParams();
  
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewPaymentSchedule, setPreviewPaymentSchedule] = useState(false);

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
      const response = await updateLoanApplication(payload);

      if (response?.payload.success === true) {
        setErrorMessage("");
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

  const handleGetSingleLoanApplication = async () => {
    setLoading(true);
    try {
      const response = await getSingleLoanApplication({applicationId, get_repayment: true});

      if (response?.payload?.data.application) {
        setErrorMessage("");
        setResult(response.payload.data.application);
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
    handleGetSingleLoanApplication();
  }, []);

  return (
    <>
      {
        previewPaymentSchedule ? 
          <LoanDetail
            result={result}
            setPreviewPaymentSchedule={setPreviewPaymentSchedule}
          />
        :
        <div className="si__st__app">
          <section className="admin__single__notice__section__one">
            <div className="admin__single__notice__section__one__article1 flex justify-between">
              <h1>{`Loan application from ${result.firstName} ${result.lastName}`}</h1>
              {/* <Link 
                to={`/main/loan/applications/${result?.id}/payment-schedules`}
                className="btn btn-primary"
              >
                  See Payment Schedule
              </Link> */}
              {
                result.status === "active" && 
                <button 
                  className="btn btn-primary"
                  onClick={() => setPreviewPaymentSchedule(true)}
                >
                  See Payment Schedule
                </button>
              }

              {
                result.status === "inactive" && 
                <button 
                  className="btn btn-primary"
                  onClick={() => setPreviewPaymentSchedule(true)}
                >
                  See Payment History
                </button>
              }
            </div >
            <article className="admin__single__notice__section__one__article2">
              <span>
                <h1>Application Date</h1>
                <h3>{ngDateTimeFormat(result.createdAt)}</h3>
              </span>
              <span>
                <h1>User Name</h1>
                <h3>{`${result.firstName} ${result.lastName}`}</h3>
              </span>
              <span>
                <h1>Application Number</h1>
                <h3>{result.id}</h3>
              </span>
              <span>
                <h1>Amount</h1>
                <h3>{result.amount}</h3>
              </span>
              <span>
                <h1>Email</h1>
                <h3>{result.email}</h3>
              </span>
              <span>
                <h1>Phone</h1>
                <h3>{result.phone}</h3>
              </span>
              <span>
                <h1>Date of Birth</h1>
                <h3>{ngDateFormat(result.dob)}</h3>
              </span>
              <span>
                <h1>Gender</h1>
                <h3>{result.gender}</h3>
              </span>
              <span>
                <h1>Bank Verification Number</h1>
                <h3>{result.bvn}</h3>
              </span>
              <span>
                <h1>Nationa Identification Number</h1>
                <h3>{result.nin}</h3>
              </span>
              <span>
                <h1>Address</h1>
                <h3>{result.address}</h3>
              </span>
              <span>
                <h1>Employment Status</h1>
                <h3>{result.employmentStatus}</h3>
              </span>
              <span>
                <h1>Employer Name</h1>
                <h3>{result.employerName}</h3>
              </span>
              <span>
                <h1>Job Title</h1>
                <h3>{result.jobTitle}</h3>
              </span>
              <span>
                <h1>Employment Address</h1>
                <h3>{result.employmentAddress}</h3>
              </span>
              <span>
                <h1>Next of Kin Name</h1>
                <h3>{`${result.nokFirstName} ${result.nokLastName}`}</h3>
              </span>
              <span>
                <h1>Next of Kin Email</h1>
                <h3>{result.nokEmail}</h3>
              </span>
              <span>
                <h1>Next of Kin Phone</h1>
                <h3>{result.nokPhone}</h3>
              </span>
              <span>
                <h1>Next of Kin Relationship</h1>
                <h3>{result.nokRelationship}</h3>
              </span>
              
              <span>
                <h1>Guarantor Name</h1>
                <h3>{`${result.guarantorFirstName} ${result.guarantorLastName}`}</h3>
              </span>
              <span>
                <h1>Guarantor Email</h1>
                <h3>{result.guarantorEmail}</h3>
              </span>
              <span>
                <h1>Guarantor Phone</h1>
                <h3>{result.guarantorPhone}</h3>
              </span>
              <span>
                <h1>Guarantor Occupation</h1>
                <h3>{result.guarantorOccupation}</h3>
              </span>
              <span>
                <h1>Guarantor Home Address</h1>
                <h3>{result.guarantorHomeAddress}</h3>
              </span>
              <span>
                <h1>Guarantor Office Address</h1>
                <h3>{result.guarantorOfficeAddress}</h3>
              </span>
              <span>
                <h1>Status</h1>
                <h3>{result.status}</h3>
              </span>
            </article>
            {
              result.status === "pending" && 
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

            }
            
          </section>
        </div>
      }
      
    </>
  );
}

export default SingleLoanApplications;
