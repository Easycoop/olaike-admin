import "./Admin.loan.applications.css";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLoanApplications, useGetSocietyLoanApplications  } from "../../redux/actions/applicationAction";
import { useEffect, useState } from "react";
import LoanApplicationList from "./LoanApplicationList";

function AdminLoanApplication() {
  const {status, groupId} = useParams();
   console.log(status);
  const getLoanApplications = useGetLoanApplications();
  const getSocietyLoanApplications = useGetSocietyLoanApplications();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const loanStatusMap = {
    "pending": {
      text:"pending",
      color: "text-yellow-600",
    },

    "approved": {
      text:"active",
      color: "text-green-600",
    },

    "declined": {
      text:"rejected",
      color: "text-red-600",
    },

    "completed":{
      text:"inactive",
      color: "text-blue-600"
    }
  }

  const handleGetLoanApplications = async () => {
    setLoading(true);
    try {
      const response = groupId ? await getSocietyLoanApplications({groupId: groupId, status: loanStatusMap[status]["text"]}) : await getLoanApplications(loanStatusMap[status]["text"]);
      if (response?.payload.success === true) {
        setResult(response.payload.data.result);
        return;
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLoanApplications();
  }, [status]);

  return (
   <LoanApplicationList result={result} navigate={navigate} status={status} loading={loading} statusMap={loanStatusMap} />
  );
}

export default AdminLoanApplication;
