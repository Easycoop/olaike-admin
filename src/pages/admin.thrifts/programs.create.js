import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConfigContext } from "../../context/ConfigProvider";
// Ensure these map to your actual Redux action imports!
import { useCreateContribution, useGetSociety } from "../../redux/actions/societyAction";
import ClipLoader from "react-spinners/ClipLoader";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import toastManager from "../../components/ui/toast/ToasterManager";
import { runValidation } from "../../utils/buchi";

const CreateContributionScreen = () => {
  const { groupId } = useParams(); 
  const navigate = useNavigate();
  const { config } = useContext(ConfigContext);

  // API Hooks
  const createContribution = useCreateContribution();
  const getSociety = useGetSociety();

  const thriftFrequency = config?.settings?.union?.thriftFrequency || "weekly";

  // Local State
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // The Payload State (Now strictly following the 3-Tier Architecture)
  const [newContribution, setNewContribution] = useState({
    title: "",
    planType: "flexible", // flexible, goal, fixed
    minAmount: "",
    fixedAmount: "",
    startDate: "",
    endDate: "",
    deadline: "",
    deadlineTime: "",
    deadlineDay: null,
    status: "active",
  });

  // 1. Fetch defaults (like minAmount) on mount based on Union/Society settings
  useEffect(() => {
    const fetchDefaults = async () => {
      let defaultMinAmount = "";

      if (config?.settings?.thriftControl === "Union") {
        defaultMinAmount = config?.settings?.union?.minimumThriftAmount || "";
      } else if (config?.settings?.thriftControl === "Society") {
        try {
          const res = await getSociety(groupId);
          if (res?.payload?.status === "success" || res?.payload?.status === true) {
            defaultMinAmount = res.payload.data.minimumThriftAmount;
          }
        } catch (error) {
          console.error("Failed to fetch society defaults", error);
        }
      }

      setNewContribution((prev) => ({
        ...prev,
        minAmount: defaultMinAmount,
        deadline: thriftFrequency === "daily" ? "23:59" : "",
      }));
    };

    fetchDefaults();
  }, [config, groupId, thriftFrequency]);

  // 2. Validation Logic
  const validateContributionForm = async () => {
    setValidationErrors([]);
    const rules = [
      { input: { value: newContribution.title, field: "title", type: "text" }, rules: { required: true } },
      { input: { value: newContribution.startDate, field: "startDate", type: "text" }, rules: { required: true } },
      { input: { value: newContribution.endDate, field: "endDate", type: "text" }, rules: { required: true } },
      { input: { value: newContribution.status, field: "status", type: "text" }, rules: { required: true } },
    ];

    // Validate Amount based on Plan Type
    if (newContribution.planType === "fixed") {
      rules.push({ input: { value: newContribution.fixedAmount, field: "fixedAmount", type: "text" }, rules: { required: true } });
    } else {
      rules.push({ input: { value: newContribution.minAmount, field: "minAmount", type: "text" }, rules: { required: true } });
    }

    // Validate Deadline based on Frequency
    switch (thriftFrequency.toLowerCase()) {
      case "weekly":
      case "daily":
        rules.push({ input: { value: newContribution.deadline, field: "deadline", type: "text" }, rules: { required: true } });
        break;
      case "monthly":
        rules.push(
          { input: { value: newContribution.deadlineDay, field: "deadlineDay", type: "number" }, rules: { required: true } },
          { input: { value: newContribution.deadlineTime, field: "deadlineTime", type: "text" }, rules: { required: true } }
        );
        break;
      default:
        break;
    }

    const validate = await runValidation(rules);

    if (validate?.status === false) {
      setValidationErrors(validate.errors);
    } else {
      submitNewContribution();
    }
  };

  // 3. Submit Logic
  const submitNewContribution = async () => {
    // Clean up payload: don't send minAmount if fixed, don't send fixedAmount if flexible
    const payload = {
      ...newContribution,
      groupId,
      minAmount: newContribution.planType !== "fixed" ? newContribution.minAmount : 0,
      fixedAmount: newContribution.planType === "fixed" ? newContribution.fixedAmount : null,
    };

    try {
      setLoading(true);
      const response = await createContribution(payload);
      
      if (response?.payload?.status === "success") {
        toastManager.addToast({ message: "Thrift Program created successfully", type: "success" });
        // Redirect back to the List screen we just created!
        navigate(`/main/societies/${groupId}/thrift-programs`);
      } else {
        toastManager.addToast({ message: response?.payload?.message || "Something went wrong", type: "error" });
      }
    } catch (error) {
      toastManager.addToast({ message: error?.payload?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 4. Dynamic Deadline Renderer
  const renderDeadlineField = () => {
    switch (thriftFrequency.toLowerCase()) {
      case "weekly":
        return (
          <div className="form-group">
            <label className="form-label">Weekly Deadline</label>
            <select
              className="form-select"
              value={newContribution.deadline || ""}
              onChange={(e) => setNewContribution({ ...newContribution, deadline: e.target.value })}
            >
              <option value="">--</option>
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <ValidationError validationErrors={validationErrors} field="deadline" />
          </div>
        );
      case "daily":
        return (
          <div className="form-group">
            <label className="form-label">Deadline Time</label>
            <input
              type="time"
              className="form-control"
              value={newContribution.deadline || ""}
              onChange={(e) => setNewContribution({ ...newContribution, deadline: e.target.value })}
            />
            <ValidationError validationErrors={validationErrors} field="deadline" />
          </div>
        );
      case "monthly":
        return (
          <>
            <div className="form-group mb-2">
              <label className="form-label">Deadline Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                className="form-control"
                value={newContribution.deadlineDay || null}
                onChange={(e) => setNewContribution({ ...newContribution, deadlineDay: e.target.value })}
              />
              <ValidationError validationErrors={validationErrors} field="deadlineDay" />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline Time</label>
              <input
                type="time"
                className="form-control"
                value={newContribution.deadlineTime || ""}
                onChange={(e) => setNewContribution({ ...newContribution, deadlineTime: e.target.value })}
              />
              <ValidationError validationErrors={validationErrors} field="deadlineTime" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#003399]">Create Thrift Program</h1>
          <p className="text-gray-600 mt-1">Configure a new savings plan for this society.</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
          Go Back
        </button>
      </div>

      <section className="bg-white border border-[#003399]/20 rounded-xl p-6 shadow-sm">
        <div className="row mb-3">
          
          {/* Title */}
          <div className="col-md-4 px-2 mb-4">
            <div className="form-group">
              <label className="form-label">Program Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 2026 Building Fund"
                value={newContribution.title || ""}
                onChange={(e) => setNewContribution({ ...newContribution, title: e.target.value })}
              />
              <ValidationError validationErrors={validationErrors} field="title" />
            </div>
          </div>

          {/* Plan Type */}
          <div className="col-md-4 px-2 mb-4">
            <div className="form-group">
              <label className="form-label">Plan Type</label>
              <select
                className="form-select"
                value={newContribution.planType || "flexible"}
                onChange={(e) => setNewContribution({ ...newContribution, planType: e.target.value })}
              >
                <option value="flexible">Flexible (User chooses, any time)</option>
                <option value="goal">Goal-Based (User sets strict pledge)</option>
                <option value="fixed">Fixed (Admin sets strict amount)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Amount Field */}
          <div className="col-md-4 px-2 mb-4">
            {newContribution.planType === "fixed" ? (
              <div className="form-group">
                <label className="form-label">Fixed Amount (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Exact amount everyone must pay"
                  value={newContribution.fixedAmount || ""}
                  onChange={(e) => setNewContribution({ ...newContribution, fixedAmount: e.target.value })}
                />
                <ValidationError validationErrors={validationErrors} field="fixedAmount" />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Minimum Amount (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Minimum allowed amount"
                  value={newContribution.minAmount || ""}
                  // Only disable if config forces a strict minimum and it has been populated
                  disabled={config?.settings?.thriftControl === "Union" && newContribution.minAmount !== ""}
                  step={50}
                  onChange={(e) => setNewContribution({ ...newContribution, minAmount: e.target.value })}
                />
                <ValidationError validationErrors={validationErrors} field="minAmount" />
              </div>
            )}
          </div>

          {/* Start Date */}
          <div className="col-md-4 px-2 mb-4">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={newContribution.startDate || ""}
                onChange={(e) => setNewContribution({ ...newContribution, startDate: e.target.value })}
              />
              <ValidationError validationErrors={validationErrors} field="startDate" />
            </div>
          </div>

          {/* End Date */}
          <div className="col-md-4 px-2 mb-4">
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={newContribution.endDate || ""}
                onChange={(e) => setNewContribution({ ...newContribution, endDate: e.target.value })}
              />
              <ValidationError validationErrors={validationErrors} field="endDate" />
            </div>
          </div>

          {/* Deadline (Calls the switch statement) */}
          <div className="col-md-4 px-2 mb-4">
            {renderDeadlineField()}
          </div>

          {/* Status */}
          <div className="col-md-4 px-2 mb-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={newContribution.status || ""}
                onChange={(e) => setNewContribution({ ...newContribution, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ValidationError validationErrors={validationErrors} field="status" />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => navigate(-1)} 
            disabled={loading}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={validateContributionForm}
            className="btn btn-primary"
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Save Program"}
          </button>
        </div>

      </section>
    </div>
  );
};

export default CreateContributionScreen;