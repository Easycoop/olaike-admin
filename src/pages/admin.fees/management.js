import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import toastManager from "../../components/ui/toast/ToasterManager";
import Modal from "../../components/ui/modal/Modal";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import { runValidation } from "../../utils/buchi";
import "../Admin.update.society/Admin.update.society.css";

// Placeholder imports for your Redux actions
import { useGetFees, useCreateFee, useUpdateFee, useDeleteFee } from "../../redux/actions/feeAction";
import { useGetSubWallets } from "../../redux/actions/walletAction";

const FeeManagementScreen = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // API Hooks (Mocked for now)
  const getFees = useGetFees();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const deleteFee = useDeleteFee();
  const getSubWallets = useGetSubWallets();

  // Local State
  const [loadingInit, setLoadingInit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fees, setFees] = useState([
        { id: "1", name: "Building Fund", applicableTo: "thrift_payment", amountType: "flat", amount: 50, isActive: true },
        { id: "2", name: "Processing Fee", applicableTo: "loan_disbursement", amountType: "percentage", amount: 2.5, isActive: true },
      ]);
  const [subWallets, setSubWallets] = useState([
        { id: "wallet-1", name: "Fees" },
        { id: "wallet-2", name: "Admin" },
        { id: "wallet-3", name: "Welfare" },
      ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    applicableTo: "thrift_payment",
    amountType: "flat",
    amount: "",
    destinationSubWalletId: "",
    isActive: "true",
  });

  // Fetch Data
  const fetchData = async () => {
    setLoadingInit(true);
    try {
      // Fetch Fees
      const feeRes = await getFees(groupId);
      setFees(feeRes?.payload?.data || []);

      // Fetch SubWallets (so admin can pick where the fee goes)
      const walletRes = await getSubWallets(groupId);
      console.log("walletRes", walletRes);
      setSubWallets(walletRes?.payload?.data || []);

      // MOCK DATA
    //   setFees([
    //     { id: "1", name: "Building Fund", applicableTo: "thrift_payment", amountType: "flat", amount: 50, isActive: true },
    //     { id: "2", name: "Processing Fee", applicableTo: "loan_disbursement", amountType: "percentage", amount: 2.5, isActive: true },
    //   ]);
    //   setSubWallets([
    //     { id: "wallet-1", name: "Fees" },
    //     { id: "wallet-2", name: "Admin" },
    //     { id: "wallet-3", name: "Welfare" },
    //   ]);
    } catch (error) {
      toastManager.addToast({ message: "Failed to load data", type: "error" });
    } finally {
      setLoadingInit(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Modal for Create or Edit
  const openModal = (fee = null) => {
    if (fee) {
      setFormData({
        id: fee.id,
        name: fee.name,
        applicableTo: fee.applicableTo,
        amountType: fee.amountType,
        amount: fee.amount,
        destinationSubWalletId: fee.destinationSubWalletId || "",
        isActive: fee.isActive.toString(),
      });
    } else {
      setFormData({
        id: "",
        name: "",
        applicableTo: "thrift_payment",
        amountType: "flat",
        amount: "",
        destinationSubWalletId: "",
        isActive: "true",
      });
    }
    setValidationErrors([]);
    setIsModalOpen(true);
  };

  // Validate & Submit
  const handleSubmit = async () => {
    setValidationErrors([]);
    const rules = [
      { input: { value: formData.name, field: "name", type: "text" }, rules: { required: true } },
      { input: { value: formData.amount, field: "amount", type: "number" }, rules: { required: true } },
      { input: { value: formData.destinationSubWalletId, field: "destinationSubWalletId", type: "text" }, rules: { required: true } },
    ];

    const validate = await runValidation(rules);

    if (validate?.status === false) {
      setValidationErrors(validate.errors);
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        groupId, // Inject society ID
        isActive: formData.isActive === "true",
        scope: "society", // Hardcode scope for society admins
      };

      let savedFee;

      if (formData.id) {
        await updateFee(payload);
      } else {
        savedFee = await createFee(payload);
      }
      
      if (savedFee) {
        console.log("savedFee", savedFee);  
        toastManager.addToast({ message: `Fee successfully ${formData.id ? "updated" : "created"}`, type: "success" });

      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toastManager.addToast({ message: "Something went wrong", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#003399]">Fee Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            Configure dynamic rules and automated deductions for your society.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
            Go Back
          </button>
          <button onClick={() => openModal()} className="btn btn-primary">
            + Create New Fee
          </button>
        </div>
      </div>

      {/* Fees List */}
      <div className="bg-white border border-[#003399]/20 rounded-xl shadow-sm overflow-hidden">
        {loadingInit ? (
          <div className="p-8 text-center text-gray-500">Loading fees...</div>
        ) : fees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No dynamic fees configured yet.</div>
        ) : (
          <div className="table-responsive-custom p-4">
            <table className="table table-custom text-start table-hover w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Fee Name</th>
                  <th className="p-3">Applied During</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount / %</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-b">
                    <td className="p-3 font-medium text-[#003399]">{fee.name}</td>
                    <td className="p-3 text-capitalize text-gray-600">
                      {fee.applicableTo.replace("_", " ")}
                    </td>
                    <td className="p-3 text-capitalize">{fee.amountType}</td>
                    <td className="p-3 font-medium">
                      {fee.amountType === "flat" ? `₦${fee.amount}` : `${fee.amount}%`}
                    </td>
                    <td className="p-3">
                      <span className={`badge ${fee.isActive ? "bg-success" : "bg-secondary"}`}>
                        {fee.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => openModal(fee)} className="btn btn-sm btn-outline-primary">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
     <div className="container bg-grey society-setting">

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal__withdraw1">
          <div className="border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-[#003399]">
              {formData.id ? "Edit Fee Rule" : "Create Fee Rule"}
            </h3>
          </div>

          <div className="row mb-3">
            {/* Name */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Fee Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Building Fund"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <ValidationError validationErrors={validationErrors} field="name" />
              </div>
            </div>

            {/* Applicable To */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Apply During</label>
                <select
                  name="applicableTo"
                  className="form-select"
                  value={formData.applicableTo}
                  onChange={handleInputChange}
                >
                  <option value="thrift_payment">Thrift Payments</option>
                  <option value="loan_application">Loan Applications</option>
                  <option value="loan_disbursement">Loan Disbursements</option>
                  <option value="registration">Registration</option>
                </select>
              </div>
            </div>

            {/* Amount Type */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Amount Type</label>
                <select
                  name="amountType"
                  className="form-select"
                  value={formData.amountType}
                  onChange={handleInputChange}
                >
                  <option value="flat">Flat Amount (₦)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
            </div>

            {/* Amount */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Value</label>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  placeholder={formData.amountType === "flat" ? "e.g. 50" : "e.g. 2.5"}
                  step={formData.amountType === "percentage" ? "0.1" : "1"}
                  value={formData.amount}
                  onChange={handleInputChange}
                />
                <ValidationError validationErrors={validationErrors} field="amount" />
              </div>
            </div>

            {/* Destination Wallet */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Destination Wallet</label>
                <select
                  name="destinationSubWalletId"
                  className="form-select"
                  value={formData.destinationSubWalletId}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Wallet --</option>
                  {subWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} Sub-Wallet
                    </option>
                  ))}
                </select>
                <ValidationError validationErrors={validationErrors} field="destinationSubWalletId" />
              </div>
            </div>

            {/* Status */}
            <div className="col-md-6 px-2 mb-3">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="isActive"
                  className="form-select"
                  value={formData.isActive}
                  onChange={handleInputChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
            <button
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? <ClipLoader color="#fff" size={20} /> : "Save Rule"}
            </button>
          </div>
        </div>
      </Modal>
     </div>
      
    </div>
  );
};

export default FeeManagementScreen;