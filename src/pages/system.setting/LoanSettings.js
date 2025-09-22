import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import toastManager from "../../components/ui/toast/ToasterManager";
import { useUpdateLoanSettings, useGetLoanSettings } from "../../redux/actions/configAction";
import { useSelector } from "react-redux";
import Modal from "../../components/ui/modal/Modal";
import Select from "../../components/ui/form-elements/select";
import {useGetSocieties} from '../../redux/actions/societyAction';
import Button from "../../components/ui/button/Button";

export const SelectSociety = ({setGroupId, setIsOpen, setChosenSociety}) => {
    const [societies, setSocieties] = useState([]);
    const [selectedSociety, setSelectedSociety] = useState();
    const getSocieties = useGetSocieties();

    const fetchSocieties =  async () => {
        try {
            const response = await getSocieties();

        if (
            response?.payload.status === 200 ||
            response?.payload.status === "success"
        ) {

            setSocieties(response.payload.data.groups);
            return;
        } else {
            toastManager.addToast({
                message: response.message,
                type: "error",
            })
        }
        } catch (error) {
            toastManager.addToast({
                message: error.response?.message,
                type: "error",
            })
        } 
    }

    const handleGroupSelection = () => {
        if(!selectedSociety){
            toastManager.addToast({
                message: "Please select a society",
                type: "error",
            })
            return;
        }
            
        setGroupId(selectedSociety);
        setIsOpen(false);
        setChosenSociety(societies.find(item => item.id === selectedSociety));
    }

    useEffect(() => {
        fetchSocieties();
    }, []);

    return(
        <div>
            <p>Select society to proceed</p>
            <form>
                <div>
                    <Select
                        options={societies.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            };
                        })}
                        onChange={(e) => setSelectedSociety(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <Button children="Save" type={"button"} className={"primary"} onClick={handleGroupSelection}/>
                </div>
                
            </form>
        </div>
    )
}

const LoanSettings = () => {

    
    const [loanInterestRate, setLoanInterestRate] = useState("");
    const [loanInterestType, setLoanInterestType] = useState("");
    const [loanRepaymentDuration, setLoanRepaymentDuration] = useState("");
    const [loanDurationType, setLoanDurationType] = useState("");
    const [loanApplicationFee, setLoanApplicationFee] = useState("");
    const [validationErrors, setValidationErrors] = useState();
    const [loading, setLoading] = useState(false);
    const [groupId, setGroupId] = useState();
    const [chosenSociety, setChosenSociety] = useState();
    const [isOpen, setIsOpen] = useState(groupId ? false : true);

    const [settingsControl, setSettingsControl] = useState(
        localStorage.getItem('easycoop_config') &&  
        JSON.parse(localStorage.getItem('easycoop_config'))?.settings 
            ? JSON.parse(localStorage.getItem('easycoop_config')).settings 
            : null
    );


    const getLoanSettings = useGetLoanSettings();
    const updateLoanSettings = useUpdateLoanSettings();

    const {roles, user} = useSelector(state => state.auth);
    
    const isSuperAdmin  = roles?.includes("SuperAdmin");


    const closeModal = () => {
        setIsOpen(false);
    }

     const fetchLoanSettings = async () => {
        try {
            const response = await getLoanSettings(groupId);
            const data = response?.payload?.data;
            if (data) {
            setLoanInterestRate(data.loanInterestRate ?? "");
            setLoanInterestType(data.loanInterestType ?? "");
            setLoanRepaymentDuration(data.loanRepaymentDuration ?? "");
            setLoanDurationType(data.loanDurationType ?? "");
            setLoanApplicationFee(data.loanApplicationFee ?? "");
            }
        } catch (error) {
            console.error("Error fetching group settings", error);
        }
    };
 
  // Fetch current settings
useEffect(() => {
    console.log(settingsControl);   
    if(settingsControl?.loanSettingsControl === 'Society'){
        fetchLoanSettings()
    }
    if(settingsControl?.loanSettingsControl === 'Union'){
        // console.log(groupId)
        setLoanInterestRate(settingsControl.union?.loanInterestRate ?? "");
        setLoanInterestType(settingsControl.union?.loanInterestType ?? "");
        setLoanRepaymentDuration(settingsControl.union?.loanRepaymentDuration ?? "");
        setLoanDurationType(settingsControl.union?.loanDurationType ?? "");
        setLoanApplicationFee(settingsControl.union?.loanApplicationFee ?? "");
    }

    // ;
}, [groupId]);

useEffect(() => {
  if (settingsControl?.loanSettingsControl === 'Union') {
    setGroupId(settingsControl.union?.id);
  }
  if (settingsControl?.loanSettingsControl === 'Society' && !isSuperAdmin) {
    setGroupId(user.Group?.id);
  }
}, [settingsControl, isSuperAdmin, user]);


// useEffect(() => {
//     console.log("loanInterestRate", loanInterestRate);
// }, [loanInterestRate])


  const validateForm = async () => {
    console.log('validation')
    console.log({
        loan_interest_rate: loanInterestRate,
        loan_interest_type: loanInterestType,
        loan_repayment_duration: loanRepaymentDuration,
        loan_duration_type: loanDurationType,
        loan_application_fee: loanApplicationFee
    })
    const validate = await runValidation([
      { input: { value: loanInterestRate, field: "loan_interest_rate", type: "number" }, rules: { required: true } },
      { input: { value: loanInterestType, field: "loan_interest_type", type: "text" }, rules: { required: true } },
      { input: { value: loanRepaymentDuration, field: "loan_repayment_duration", type: "number" }, rules: { required: true } },
      { input: { value: loanDurationType, field: "loan_duration_type", type: "text" }, rules: { required: true } },
      { input: { value: loanApplicationFee, field: "loan_application_fee", type: "number" }, rules: { required: true } },
    ]);

    if (validate?.status === false) {
        console.log(validate)
      setValidationErrors(validate.errors);
    } else {
        setValidationErrors(null);
      handleSave();
    }
  };

    const handleSave = async () => {
        console.log("saving");
        try {
            setLoading(true);

            if (!groupId) {
            toastManager.addToast({
                message: "Please select a society",
                type: "error",
            });
            setIsOpen(true);
            return;
            }

            // ✅ Pass groupId and payload as a single object (matching thunk definition)
            const response = await updateLoanSettings({
            groupId,
            payload: {
                loan_interest_rate: loanInterestRate,
                loan_interest_type: loanInterestType,
                loan_repayment_duration: loanRepaymentDuration,
                loan_duration_type: loanDurationType,
                loan_application_fee: loanApplicationFee,
            },
            });

            if (response?.payload?.status === "success") {
            toastManager.addToast({
                message: "Loan settings updated successfully",
                type: "success",
            });
            } else {
            toastManager.addToast({
                message: response?.payload?.message || "Failed to update loan settings",
                type: "error",
            });
            }
        } catch (error) {
            console.error("Error updating loan settings", error);
            toastManager.addToast({
            message: error.message || "Unexpected error occurred",
            type: "error",
            });
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#003399]">Loan Settings</h2>
            { isSuperAdmin && settingsControl?.loanSettingsControl === 'Society' && 
                <div className="flex justify-between items-center gap-2">
                    <p>
                        Current Society: <span className="font-semibold text-[#003399] bg-[#6699FF]/20 px-2 py-1 rounded">{chosenSociety?.name}</span>
                    </p>
                    <Button className={"primary"} children="Change Society" onClick={() => setIsOpen(true)} />
                </div>
            }
                
            
        </div>
      
      <hr className="border-[#6699FF]" />

      {/* Interest Rate */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Loan Interest Rate (%)</label>
        <input
          type="number"
          value={loanInterestRate}
          onChange={(e) => setLoanInterestRate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        />
        <ValidationError validationErrors={validationErrors} field="loan_interest_rate" />
      </div>

      {/* Interest Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Interest Type</label>
        <select
          value={loanInterestType}
          onChange={(e) => setLoanInterestType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        >
          <option value="" disabled>Select type</option>
          <option value="fixed">Fixed</option>
          <option value="reduction">Reduction</option>
        </select>
        <ValidationError validationErrors={validationErrors} field="loan_interest_type" />
      </div>

      {/* Repayment Duration */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Repayment Duration</label>
        <input
          type="number"
          value={loanRepaymentDuration}
          onChange={(e) => setLoanRepaymentDuration(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        />
        <ValidationError validationErrors={validationErrors} field="loan_repayment_duration" />
      </div>

      {/* Duration Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Duration Type</label>
        <select
          value={loanDurationType}
          onChange={(e) => setLoanDurationType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        >
          <option value="" disabled>Select duration type</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
        </select>
        <ValidationError validationErrors={validationErrors} field="loan_duration_type" />
      </div>

      {/* Loan Application Fee */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Loan Application Fee</label>
        <input
          type="number"
          value={loanApplicationFee}
          onChange={(e) => setLoanApplicationFee(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        />
        <ValidationError validationErrors={validationErrors} field="loan_application_fee" />
      </div>

      <button
        onClick={validateForm}
        className="w-full bg-[#003399] hover:bg-[#002080] text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? <><ClipLoader size={20} color="#fff" /> Saving...</> : "Save Loan Settings"}
      </button>
    
        {
            isSuperAdmin && settingsControl?.loanSettingsControl === 'Society'  && 
            <Modal isOpen={isOpen} onClose={closeModal}  children={<SelectSociety setGroupId={setGroupId} setIsOpen={setIsOpen} setChosenSociety={setChosenSociety} />} />
        }
    </div>
  );
};

export default LoanSettings;
