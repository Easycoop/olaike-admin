import { useState, useEffect } from "react";
import { useGetUnionSettings, useUpdateUnionSettings } from "../../redux/actions/configAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";

const UnionSettings = () => {
  const [loanSettingsControl, setLoanSettingsControl] = useState("");
  const [entranceFeeControl, setEntranceFeeControl] = useState("");
  const [thriftControl, setThriftControl] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState();

  const getUnionSettings = useGetUnionSettings();
  const updateUnionSettings = useUpdateUnionSettings();

  const handleGetSettings = async () => {
    try {
      const response = await getUnionSettings();
      console.log(response);
      if (response.error) {
        toastManager.addToast({
          message: response.error.message,
          type: "error",
        });
      }
      const settings = response?.payload?.data;
      if (settings) {
        setLoanSettingsControl(settings.loanSettingsControl || "");
        setEntranceFeeControl(settings.entranceFeeControl || "");
        setThriftControl(settings.thriftControl || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateSettings = async () => {
    const validate = await runValidation([
      {
        input: { value: loanSettingsControl, field: "loan_settings_control", type: "text" },
        rules: { required: true },
      },
      {
        input: { value: entranceFeeControl, field: "entrance_fee_control", type: "text" },
        rules: { required: true },
      },
      {
        input: { value: thriftControl, field: "thrift_control", type: "text" },
        rules: { required: true },
      },
    ]);

    if (validate?.status === false) {
      setValidationErrors(validate.errors);
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateUnionSettings({
        loan_settings_control: loanSettingsControl,
        entrance_fee_control: entranceFeeControl,
        thrift_control: thriftControl,
      });

      console.log(response)

      if (response.payload?.status === "success") {
        toastManager.addToast({
          message: response.payload?.message || "Union settings updated successfully",
          type: "success",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetSettings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#003399] mb-6">
        Union Settings
      </h1>

      {/* Card */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">Control Settings</h2>
        <hr style={{ border: "1px solid #6699FF" }} />

        {/* Loan Settings Control */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Who Controls Loan Settings?
          </label>
          <select
            value={loanSettingsControl}
            onChange={(e) => setLoanSettingsControl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          >
            <option value="" disabled>
              Select Controller
            </option>
            <option value="Union">Union (Super Admin)</option>
            <option value="Society">Society (Sub Admin)</option>
          </select>
          <ValidationError validationErrors={validationErrors} field="loan_settings_control" />
        </div>

        {/* Entrance Fee Control */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Who Controls Entrance Fee?
          </label>
          <select
            value={entranceFeeControl}
            onChange={(e) => setEntranceFeeControl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          >
            <option value="" disabled>
              Select Controller
            </option>
            <option value="Union">Union (Super Admin)</option>
            <option value="Society">Society (Sub Admin)</option>
          </select>
          <ValidationError validationErrors={validationErrors} field="entrance_fee_control" />
        </div>

        {/* Thrift Control */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Who Controls Thrift Settings?
          </label>
          <select
            value={thriftControl}
            onChange={(e) => setThriftControl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
          >
            <option value="" disabled>
              Select Controller
            </option>
            <option value="Union">Union (Super Admin)</option>
            <option value="Society">Society (Sub Admin)</option>
          </select>
          <ValidationError validationErrors={validationErrors} field="thrift_control" />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={validateSettings}
            className="w-full bg-[#003399] hover:bg-[#002080] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <ClipLoader color="#fff" size={20} /> {"Saving..."}
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnionSettings;
