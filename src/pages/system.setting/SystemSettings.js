import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import toastManager from "../../components/ui/toast/ToasterManager";
import { useSelector } from "react-redux";
import { useUpdateSystemSettings, useGetLoanSettings } from "../../redux/actions/configAction";
import Modal from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { SelectSociety } from "./LoanSettings";

const SystemSettings = () => {
  const [entranceFee, setEntranceFee] = useState("");
  const [validationErrors, setValidationErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState();
  const [chosenSociety, setChosenSociety] = useState();
  const [isOpen, setIsOpen] = useState(groupId ? false : true);

  const [settingsControl, setSettingsControl] = useState(
    localStorage.getItem("easycoop_config") &&
    JSON.parse(localStorage.getItem("easycoop_config"))?.settings
      ? JSON.parse(localStorage.getItem("easycoop_config")).settings
      : null
  );

  const { roles, user } = useSelector((state) => state.auth);
  const isSuperAdmin = roles?.includes("SuperAdmin");

  const getEntranceFee = useGetLoanSettings();
  const updateEntranceFee = useUpdateSystemSettings();

  const closeModal = () => setIsOpen(false);

  // Fetch current entrance fee
  const fetchEntranceFee = async () => {
    try {
      const response = await getEntranceFee(groupId);
      const data = response?.payload?.data;
      if (data) {
        setEntranceFee(data.entranceFee ?? "");
      }
    } catch (error) {
      console.error("Error fetching entrance fee", error);
    }
  };

  useEffect(() => {
    if (settingsControl?.entranceFeeControl === "Society") {
      fetchEntranceFee();
    }
    if (settingsControl?.entranceFeeControl === "Union") {
      setEntranceFee(settingsControl.union?.entranceFee ?? "");
    }
  }, [groupId]);

  useEffect(() => {
    if (settingsControl?.entranceFeeControl === "Union") {
      setGroupId(settingsControl.union?.id);
    }
    if (settingsControl?.entranceFeeControl === "Society" && !isSuperAdmin) {
      setGroupId(user.Group?.id);
    }
  }, [settingsControl, isSuperAdmin, user]);

  const validateForm = async () => {
    const validate = await runValidation([
      {
        input: { value: entranceFee, field: "entrance_fee", type: "number" },
        rules: { required: true },
      },
    ]);

    if (validate?.status === false) {
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

      const response = await updateEntranceFee({
        groupId,
        payload: { entrance_fee: entranceFee },
      });

      if (response?.payload?.status === "success") {
        toastManager.addToast({
          message: "Entrance fee updated successfully",
          type: "success",
        });
      } else {
        toastManager.addToast({
          message:
            response?.payload?.message || "Failed to update entrance fee",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating entrance fee", error);
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
        <h2 className="text-lg font-semibold text-[#003399]">
          Entrance Fee Settings
        </h2>

        {isSuperAdmin && settingsControl?.entranceFeeControl === "Society" && (
          <div className="flex justify-between items-center gap-2">
            <p>
              Current Society:{" "}
              <span className="font-semibold text-[#003399] bg-[#6699FF]/20 px-2 py-1 rounded">
                {chosenSociety?.name}
              </span>
            </p>
            <Button
              className={"primary"}
              children="Change Society"
              onClick={() => setIsOpen(true)}
            />
          </div>
        )}
      </div>

      <hr className="border-[#6699FF]" />

      {/* Entrance Fee Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Entrance Fee
        </label>
        <input
          type="number"
          value={entranceFee}
          onChange={(e) => setEntranceFee(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6699FF]"
        />
        <ValidationError
          validationErrors={validationErrors}
          field="entrance_fee"
        />
      </div>

      <button
        onClick={validateForm}
        className="w-full bg-[#003399] hover:bg-[#002080] text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? (
          <>
            <ClipLoader size={20} color="#fff" /> Saving...
          </>
        ) : (
          "Save Entrance Fee"
        )}
      </button>

      {isSuperAdmin && settingsControl?.entranceFeeControl === "Society" && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          children={
            <SelectSociety
              setGroupId={setGroupId}
              setIsOpen={setIsOpen}
              setChosenSociety={setChosenSociety}
            />
          }
        />
      )}
    </div>
  );
};

export default SystemSettings;
