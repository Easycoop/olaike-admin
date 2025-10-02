import { useState } from "react";
import { useBatchOnboarding } from "../../../redux/actions/userAction";
import toastManager from "../../../components/ui/toast/ToasterManager";

const BatchOnboarding = () => {
  // state hooks
  const [contactFile, setContactFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // custom hooks
  const batchOnboard = useBatchOnboarding();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (!validTypes.includes(file.type)) {
        toastManager.addToast({
          message: "Please upload a valid Excel or CSV file.",
          type: "error",
        });
        return;
      }
      setContactFile(file);
    }
  };

  const handleUpload = async () => {
    if (!contactFile) {
      toastManager.addToast({
        message: "Please select a file before uploading.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("contact_file", contactFile);

      const response = await batchOnboard(formData);

      if (response?.status === "success") {
        toastManager.addToast({
          message: `${response?.message}`,
          type: "success",
        });
        setContactFile(null);
      } else {
        toastManager.addToast({
          message: `${response?.message}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toastManager.addToast({
        message: error?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md border border-gray-100 rounded-xl p-6 mt-3 mb-3">
      <h2 className="text-lg sm:text-xl font-semibold text-[#003399] mb-4">
        Batch Onboarding
      </h2>

      {/* File input */}
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-[#003399] file:text-white
        hover:file:bg-[#002080]
        cursor-pointer mb-3"
      />

      {/* Show selected file */}
      {contactFile && (
        <div className="text-sm text-gray-700 mb-3">
          Selected file: <span className="font-medium">{contactFile.name}</span>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#ED6E0A] text-white hover:bg-[#c95b08]"
        }`}
      >
        {loading ? "Uploading..." : "Upload & Process"}
      </button>
    </div>
  );
};

export default BatchOnboarding;
