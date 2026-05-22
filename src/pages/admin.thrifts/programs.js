import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetContributions,
  useUpdateContribution,
  useDeleteContribution,
} from "../../redux/actions/societyAction";
import { ConfigContext } from "../../context/ConfigProvider";
import toastManager from "../../components/ui/toast/ToasterManager";
import Modal from "../../components/ui/modal/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import Loading from "../../components/splash/loading/Loading";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import { formatDateStringToHtmlDate } from "../../utils/time";
import "../Admin.update.society/Admin.update.society.css";

const ThriftProgramsListScreen = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { config } = useContext(ConfigContext);

  // API Hooks
  const getContributions = useGetContributions();
  const updateContribution = useUpdateContribution();
  const deleteContribution = useDeleteContribution();

  const thriftFrequency = config?.settings?.union?.thriftFrequency || "weekly";

  // Local State
  const [loadingInit, setLoadingInit] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState({
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    deadline: "",
    planType: "flexible",
    minAmount: "",
    fixedAmount: "",
    status: "",
  });

  // Fetch Programs
  const fetchPrograms = async () => {
    setLoadingInit(true);
    try {
      const response = await getContributions(groupId);
      if (response?.payload?.status === "success" && response.payload?.data) {
        setPrograms(response.payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch programs", error);
      toastManager.addToast({ message: "Failed to load programs", type: "error" });
    } finally {
      setLoadingInit(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [groupId]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    
    try {
      const response = await deleteContribution({ id });
      if (response?.payload?.status === "success") {
        toastManager.addToast({ message: "Program deleted successfully", type: "success" });
        fetchPrograms(); // Refresh list
      } else {
        toastManager.addToast({ message: response?.payload?.message || "Delete failed", type: "error" });
      }
    } catch (error) {
      toastManager.addToast({ message: error?.payload?.message || "Something went wrong", type: "error" });
    }
  };

  // Open Edit Modal & Populate Data
  const handleOpenEdit = (program) => {
    setProgramToEdit({
      id: program.id,
      title: program.title,
      startDate: program.startDate,
      endDate: program.endDate,
      deadline: program.deadline,
      planType: program.planType || "flexible",
      minAmount: program.minAmount || "",
      fixedAmount: program.fixedAmount || "",
      status: program.status,
    });
    setValidationErrors([]);
    setEditModalOpen(true);
  };

  // Validate Edit Form
  const validateUpdateForm = async () => {
    setValidationErrors([]);
    const rules = [
      { input: { value: programToEdit.title, field: "title", type: "text" }, rules: { required: true } },
      { input: { value: programToEdit.startDate, field: "start_date", type: "text" }, rules: { required: true } },
      { input: { value: programToEdit.endDate, field: "end_date", type: "text" }, rules: { required: true } },
      { input: { value: programToEdit.status, field: "status", type: "text" }, rules: { required: true } },
    ];

    if (programToEdit.planType === "fixed") {
      rules.push({ input: { value: programToEdit.fixedAmount, field: "fixed_amount", type: "text" }, rules: { required: true } });
    } else {
      rules.push({ input: { value: programToEdit.minAmount, field: "minimum_amount", type: "text" }, rules: { required: true } });
    }

    const validate = await runValidation(rules);
    if (validate?.status === false) {
      setValidationErrors(validate.errors);
    } else {
      submitUpdate();
    }
  };

  // Submit Update
  const submitUpdate = async () => {
    const payload = {
      ...programToEdit,
      minAmount: programToEdit.planType !== "fixed" ? programToEdit.minAmount : 0,
      fixedAmount: programToEdit.planType === "fixed" ? programToEdit.fixedAmount : null,
    };

    try {
      setIsUpdating(true);
      const response = await updateContribution(payload);
      if (response?.payload?.status === "success") {
        toastManager.addToast({ message: "Program updated successfully", type: "success" });
        setEditModalOpen(false);
        fetchPrograms();
      } else {
        toastManager.addToast({ message: response?.payload?.message || "Update failed", type: "error" });
      }
    } catch (error) {
      toastManager.addToast({ message: error?.payload?.message || "Something went wrong", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loadingInit) return <Loading />;

  return (
    <div className="w-full px-4 md:px-8 py-6 create__society">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#003399]">Thrift Programs</h1>
          <p className="text-gray-600">Manage all contribution plans for this society.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
            Go Back
          </button>
          <Link to={`/main/societies/${groupId}/contributions/create`} className="btn btn-primary">
            + Create Program
          </Link>
        </div>
      </div>

      {/* List Table */}
      <section className="bg-white border border-[#003399]/20 rounded-xl shadow-sm overflow-hidden edit__user__section1 create__society__wra">
        <div className="table-responsive-custom p-4">
          {programs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No thrift programs found. Create one to get started!
            </div>
          ) : (
            <table className="table table-custom text-start table-hover w-full">
              <thead className="bg-gray-50">
                <tr className="text-start">
                  <th className="p-3">Title</th>
                  <th className="p-3">Plan Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Deadlines</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog) => (
                  <tr key={prog.id} className="border-b">
                    <td className="p-3 font-medium">{prog.title}</td>
                    <td className="p-3 text-capitalize">{prog.planType || "flexible"}</td>
                    <td className="p-3">
                      ₦{prog.planType === "fixed" ? prog.fixedAmount : prog.minAmount}
                    </td>
                    <td className="p-3">
                      <span className={`badge ${prog.status === "active" ? "bg-success" : "bg-secondary"}`}>
                        {prog.status}
                      </span>
                    </td>
                    <td className="p-3">{prog.deadline}</td>
                    <td className="p-3 text-right">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2" 
                        onClick={() => handleOpenEdit(prog)}
                      >
                        Edit
                      </button>
                      <Link 
                        to={`/main/thrifts/${prog.id}`} 
                        className="btn btn-sm btn-primary me-2"
                      >
                        View Details
                      </Link>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(prog.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="container bg-grey society-setting">
            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <div className="modal__withdraw1">
            <div className="border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-[#003399]">Edit Program</h3>
            </div>
            
            <div className="row mb-3">
                {/* Title */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                    type="text"
                    className="form-control"
                    value={programToEdit.title}
                    onChange={(e) => setProgramToEdit({ ...programToEdit, title: e.target.value })}
                    />
                    <ValidationError validationErrors={validationErrors} field="title" />
                </div>
                </div>

                {/* Plan Type */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">Plan Type</label>
                    <select
                    className="form-select"
                    value={programToEdit.planType}
                    onChange={(e) => setProgramToEdit({ ...programToEdit, planType: e.target.value })}
                    >
                    <option value="flexible">Flexible</option>
                    <option value="goal">Goal-Based</option>
                    <option value="fixed">Fixed</option>
                    </select>
                </div>
                </div>

                {/* Amount */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">
                    {programToEdit.planType === "fixed" ? "Fixed Amount" : "Minimum Amount"}
                    </label>
                    <input
                    type="number"
                    className="form-control"
                    value={programToEdit.planType === "fixed" ? programToEdit.fixedAmount : programToEdit.minAmount}
                    onChange={(e) => {
                        if (programToEdit.planType === "fixed") {
                        setProgramToEdit({ ...programToEdit, fixedAmount: e.target.value });
                        } else {
                        setProgramToEdit({ ...programToEdit, minAmount: e.target.value });
                        }
                    }}
                    />
                    <ValidationError 
                    validationErrors={validationErrors} 
                    field={programToEdit.planType === "fixed" ? "fixed_amount" : "minimum_amount"} 
                    />
                </div>
                </div>

                {/* Status */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                    className="form-select"
                    value={programToEdit.status}
                    onChange={(e) => setProgramToEdit({ ...programToEdit, status: e.target.value })}
                    >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    </select>
                    <ValidationError validationErrors={validationErrors} field="status" />
                </div>
                </div>

                {/* Start Date */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                    type="date"
                    className="form-control"
                    value={formatDateStringToHtmlDate(programToEdit.startDate)}
                    onChange={(e) => setProgramToEdit({ ...programToEdit, startDate: e.target.value })}
                    />
                    <ValidationError validationErrors={validationErrors} field="start_date" />
                </div>
                </div>

                {/* End Date */}
                <div className="col-md-6 px-2 mb-3">
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                    type="date"
                    className="form-control"
                    value={formatDateStringToHtmlDate(programToEdit.endDate)}
                    onChange={(e) => setProgramToEdit({ ...programToEdit, endDate: e.target.value })}
                    />
                    <ValidationError validationErrors={validationErrors} field="end_date" />
                </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                <button 
                className="btn btn-secondary" 
                onClick={() => setEditModalOpen(false)}
                disabled={isUpdating}
                >
                Cancel
                </button>
                <button 
                className="btn btn-primary" 
                onClick={validateUpdateForm}
                disabled={isUpdating}
                >
                {isUpdating ? <ClipLoader color="#fff" size={20} /> : "Save Changes"}
                </button>
            </div>
            </div>
        </Modal>
       </div>
      </section>

      {/* Edit Modal */}
      

    </div>
  );
};

export default ThriftProgramsListScreen;