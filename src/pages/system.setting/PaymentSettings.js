
import { useState, useEffect } from "react";
import { useUpdateLoanSettings, useGetLoanSettings } from "../../redux/actions/configAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";

const PaymentSettings = () => {
  const [interestRate, setInterestRate] = useState(0);
  const [interestType, setInterestType] = useState("");
  const [repaymentDuration, setRepaymentDuration] = useState("");
  const [durationType, setDurationType] = useState("");
  const [loanApplicationFee, setLoanApplicationFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState();

  const updateLoanSettings = useUpdateLoanSettings();
  const getLoanSettings = useGetLoanSettings();

  

  const handleGetLoanSettings = async () => {
    try {
        const response = await getLoanSettings();
        if(response.error){
            toastManager.addToast({
                message: response.error.message,
                type: "error",
            })
        }
        
        const settingsData = response?.payload?.data;
        if(settingsData.find((setting) => setting.key === "interest_rate")){
            setInterestRate(settingsData.find((setting) => setting.key === "interest_rate").value);
        } 
        if(settingsData.find((setting) => setting.key === "interest_type")){
            setInterestType(settingsData.find((setting) => setting.key === "interest_type").value);
        }
        if(settingsData.find((setting) => setting.key === "repayment_duration")){
            setRepaymentDuration(settingsData.find((setting) => setting.key === "repayment_duration").value);
        }
        if(settingsData.find((setting) => setting.key === "duration_type")){
            setDurationType(settingsData.find((setting) => setting.key === "duration_type").value);
        }
        
        if(settingsData.find((setting) => setting.key === "loan_application_fee")){
            setLoanApplicationFee(settingsData.find((setting) => setting.key === "loan_application_fee").value);
        }
        console.log(settingsData)
        
    } catch (error) {
        console.log(error);
        
    }
  }

  const validateSettings = async () => {
    const validate = await runValidation([
        {
            input: { value: interestRate, field: "interest_rate", type: "number" },
            rules: { required: true },
        },
        {
            input: { value: interestType, field: "interest_type", type: "text" },
            rules: { required: true },
        },
        {
            input: { value: repaymentDuration, field: "repayment_duration", type: "number" },
            rules: { required: true },
        },
        {
            input: { value: durationType, field: "duration_type", type: "text" },
            rules: { required: true },
        },
        {
            input: { value: loanApplicationFee, field: "loan_application_fee", type: "number" },
            rules: { required: true },
        },
        
    ]);
    if(validate?.status === false){
        setValidationErrors(validate.errors)
    }else{
        handleSave();
    }
  }
  const handleSave = async () => {
    // TODO: Hook this up to API call
    try {
        setLoading(true);
        const response = await updateLoanSettings({
            interest_rate: interestRate, 
            interest_type: interestType, 
            repayment_duration: repaymentDuration, 
            duration_type: durationType,
            loan_application_fee: loanApplicationFee
        });
        console.log(response);
        if(response.payload?.status === 'success'){
            toastManager.addToast({
                message: response.payload?.message,
                type: "success",
            })
        }
        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.log(error);
        
    }
  };


  useEffect(() => {
    handleGetLoanSettings();
  }, []);


  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#003399] mb-6">
        Loan/Payment Settings
      </h1>

      {/* Card */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 space-y-6">
        <h2>Payment Setting</h2>
        <hr style={{border:"1px solid #6699FF"}} />
        

      <h2>Loan Setting</h2>
      <hr style={{border:"1px solid #6699FF"}} />
        {/* Interest Rate */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Loan Interest Rate (%)
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          />
          <ValidationError validationErrors={validationErrors} field="interest_rate" />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Loan Application fee
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={loanApplicationFee}
            onChange={(e) => setLoanApplicationFee(e.target.value)}
            placeholder="Enter interest rate"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          />
          <ValidationError validationErrors={validationErrors} field="loan_application_fee" />
        </div>

        

        {/* Interest Type */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Interest Type
          </label>
          <select
            value={interestType}
            onChange={(e) => setInterestType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          >
            <option value="" disabled selected>Choose Interest Type</option>
            <option value="reduction">Reduction</option>
            <option value="fixed">Fixed</option>
          </select>
          <ValidationError validationErrors={validationErrors} field="interest_type" />
        </div>

         {/* Duration Type */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Duration Type
          </label>
          <select
            value={durationType}
            onChange={(e) => setDurationType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          >
            <option value="" disabled selected>Choose Duration Type</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
          <ValidationError validationErrors={validationErrors} field="duration_type" />
        </div>

        {/* Repayment Duration */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Repayment Duration
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={repaymentDuration}
            onChange={(e) => setRepaymentDuration(e.target.value)}
            placeholder="Enter duration"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          />
          <ValidationError validationErrors={validationErrors} field="repayment_duration" />
        </div>

       

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={validateSettings}
            className="w-full bg-[#003399] hover:bg-[#002080] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ?<><ClipLoader color="#fff" size={20} /> {"Saving..."}</>  : "Save settings"}
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
