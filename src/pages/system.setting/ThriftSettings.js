import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import toastManager from "../../components/ui/toast/ToasterManager";
import Modal from "../../components/ui/modal/Modal";
import Select from "../../components/ui/form-elements/select";
import Button from "../../components/ui/button/Button";
import { useGetSocieties, useUpdateThriftSettings } from "../../redux/actions/societyAction";
import {useGetLoanSettings, } from "../../redux/actions/configAction";
import axios from "axios";import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
// import { useUpdateThriftSettings } from "../../redux/actions/societyAction";

export const SelectSociety = ({ setGroupId, setIsOpen, setChosenSociety }) => {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState();
  const getSocieties = useGetSocieties();

  const fetchSocieties = async () => {
    try {
      const response = await getSocieties();

      if (response?.payload.status === 200 || response?.payload.status === "success") {
        setSocieties(response.payload.data.groups);
      } else {
        toastManager.addToast({
          message: response.message,
          type: "error",
        });
      }
    } catch (error) {
      toastManager.addToast({
        message: error.response?.message,
        type: "error",
      });
    }
  };

  const handleGroupSelection = () => {
    if (!selectedSociety) {
      toastManager.addToast({
        message: "Please select a society",
        type: "error",
      });
      return;
    }
    setGroupId(selectedSociety);
    setIsOpen(false);
    setChosenSociety(societies.find((item) => item.id === selectedSociety));
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  return (
    <div>
      <p className="mb-3 font-medium">Select society to proceed</p>
      <form>
        <div>
          <Select
            options={societies.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={(e) => setSelectedSociety(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button children="Save" type={"button"} className={"primary"} onClick={handleGroupSelection} />
        </div>
      </form>
    </div>
  );
};

const ThriftSettings = () => {
  const { roles, user } = useSelector((state) => state.auth);
  const getThriftSettings = useGetLoanSettings();
  const updateThriftSettings = useUpdateThriftSettings();
  
  const isSuperAdmin = roles?.includes("SuperAdmin");

  const [formData, setFormData] = useState({
    minimum_thrift_amount: "",
    thrift_lateness_fee: "",
    thrift_frequency: "",
  });
  
  const [validationErrors, setValidationErrors] = useState();

  const [groupId, setGroupId] = useState();
  const [chosenSociety, setChosenSociety] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  

  const [settingsControl, setSettingsControl] = useState(
    localStorage.getItem("easycoop_config") &&
      JSON.parse(localStorage.getItem("easycoop_config"))?.settings
      ? JSON.parse(localStorage.getItem("easycoop_config")).settings
      : null
  );

  const closeModal = () => setIsOpen(false);

  // Determine groupId based on settingsControl and user role
  useEffect(() => {
    console.log('user');
    console.log(user)
    if (settingsControl?.thriftControl === "Union") {
      setGroupId(settingsControl.union?.id);
    }
    if (settingsControl?.thriftControl === "Society" && !isSuperAdmin) {
      setGroupId(user.Group?.id);
    }
  }, [settingsControl, isSuperAdmin, user]);

  // Fetch thrift settings for selected group
  useEffect(() => {
    const fetchThriftSettings = async () => {
      if (!groupId) return;
      try {
        const res = await getThriftSettings(groupId)
        console.log(res)
        const group = res.payload?.data;
        if (group) {
          setFormData({
            minimum_thrift_amount: group.minimumThriftAmount || "",
            thrift_lateness_fee: group.thriftLatenessFee || "",
            thrift_frequency: group.thriftFrequency || "",
          });
        }
      } catch (err) {
        toastManager.addToast({
          message: "Cannot fetch thrift settings",
          type: "error",
        });
      }
    };

    fetchThriftSettings();
  }, [groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const validateForm = async () => {
      console.log('validation')
    //   console.log({
    //       loan_interest_rate: loanInterestRate,
    //       loan_interest_type: loanInterestType,
    //       loan_repayment_duration: loanRepaymentDuration,
    //       loan_duration_type: loanDurationType,
    //       loan_application_fee: loanApplicationFee
    //   })
      const validate = await runValidation([
        { input: { value: formData.minimum_thrift_amount, field: "minimum_thrift_amount", type: "number" }, rules: { required: true } },
        { input: { value: formData.thrift_frequency, field: "thrift_frequency", type: "text" }, rules: { required: true } },
        { input: { value: formData.thrift_lateness_fee, field: "thrift_lateness_fee", type: "number" }, rules: { required: true } },
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
      const response  = await updateThriftSettings({groupId, 
        payload:formData
      })
        if (response?.payload?.status === "success") {
            toastManager.addToast({
                message: "Thrift settings updated successfully",
                type: "success",
            });
        } else {
            toastManager.addToast({
                message: response?.payload?.message || "Failed to update thrift settings",
                type: "error",
            });
        }
    //   await axios.patch(`/api/groups/${groupId}/thrift-settings`, formData);
    //   toastManager.addToast({
    //     type: "success",
    //     message: "Thrift settings updated successfully",
    //   });
    } catch (err) {
      toastManager.addToast({
        type: "error",
        message: "Failed to update thrift settings",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#003399]">Thrift Settings</h2>
        {isSuperAdmin && settingsControl?.thriftControl === "Society" && (
          <div className="flex justify-between items-center gap-2">
            <p>
              Current Society:{" "}
              <span className="font-semibold text-[#003399] bg-[#6699FF]/20 px-2 py-1 rounded">
                {chosenSociety?.name}
              </span>
            </p>
            <Button className={"primary"} children="Change Society" onClick={() => setIsOpen(true)} />
          </div>
        )}
      </div>

      <hr className="border-[#6699FF]" />

      {/* Minimum Thrift Amount */}
      <div>
        <label className="block text-sm font-medium">Minimum Thrift Amount</label>
        <input
          type="number"
          name="minimum_thrift_amount"
          value={formData.minimum_thrift_amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Enter minimum amount"
        />
        <ValidationError validationErrors={validationErrors} field="minimum_thrift_amount" />
      </div>

      {/* Thrift Lateness Fee */}
      <div>
        <label className="block text-sm font-medium">Thrift Lateness Fee</label>
        <input
          type="number"
          name="thrift_lateness_fee"
          value={formData.thrift_lateness_fee}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Enter lateness fee"
        />
        <ValidationError validationErrors={validationErrors} field="thrift_lateness_fee" />
      </div>

      {/* Thrift Frequency */}
      <div>
        <label className="block text-sm font-medium">Thrift Frequency</label>
        <select
          name="thrift_frequency"
          value={formData.thrift_frequency}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Frequency --</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <ValidationError validationErrors={validationErrors} field="thrift_frequency" />
      </div>

      <button
        onClick={validateForm}
        disabled={loading}
        className="w-full bg-[#003399] hover:bg-[#002080] text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? <><ClipLoader size={20} color="#fff" /> Saving...</> : "Save Thrift Settings"}
      </button>

      {isSuperAdmin && settingsControl?.thriftControl === "Society" && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <SelectSociety setGroupId={setGroupId} setIsOpen={setIsOpen} setChosenSociety={setChosenSociety} />
        </Modal>
      )}
    </div>
  );
};

export default ThriftSettings;
