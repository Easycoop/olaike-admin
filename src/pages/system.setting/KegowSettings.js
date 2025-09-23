import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../../components/ui/button/Button";
import { runValidation } from "../../utils/buchi";
import ValidationError from "../../components/ui/form-elements/ValidaionError";
import toastManager from "../../components/ui/toast/ToasterManager";
import {useUpdateKegowData, useGetGroupWallet} from '../../redux/actions/walletAction';

const KegowAccountSettings = ({ groupId }) => {
    const { user } = useSelector((state) => state.auth);
    const updateKegowData = useUpdateKegowData();
    const getGroupWallet = useGetGroupWallet();

    const [validationErrors, setValidationErrors] = useState([]);

    const [formData, setFormData] = useState({
        kegow_account: "",
        // kegow_account_id:,
        kegow_account_name:"",
        // kegow_data: "",
        bank_code:"",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        try {
            const validate = runValidation([
                {
                        input: { value: groupId, field: 'groupId', type: 'text' },
                        rules: { required: true },
                    },
                    {
                        input: { value: formData.kegow_account, field: 'kegow_account', type: 'text' },
                        rules: { required: true },
                    },
                    {
                        input: { value: formData.bank_code, field: 'bank_code', type: 'text' },
                        rules: { required: true },
                    },
                    {
                        input: { value: formData.kegow_account_name, field: 'kegow_account_name', type: 'text' },
                        rules: { required: true },
                    },
            ]);

            if(validate.status === false){
            setValidationErrors(validate.errors);
            }
        setLoading(true);
        const payload = { ...formData };

        // If kegow_data is a valid JSON string, parse it before sending
        //   if (payload.kegow_data) {
        //     try {
        //       payload.kegow_data = JSON.parse(payload.kegow_data);
        //     } catch {
        //       toastManager.addToast({
        //         message: "Kegow data is not a valid JSON string",
        //         type: "error",
        //       })
        //       setLoading(false);
        //       return;
        //     }
        //   }

        const response = await updateKegowData({groupId, payload});
            // console.log('response', response)
        if (response?.payload?.status === "success") {
            toastManager.addToast({
            message: "Kegow account settings updated successfully",
            type: "success",
            });
        } else {
            toastManager.addToast({
            message:
                response?.payload?.message || "Failed to update kegow account settings",
            type: "error",
            });
        }

        } catch (err) {
        toastManager.addToast({
            message: err.response?.data?.message || "Failed to update kegow account settings",
            type: "error",
        });
        } finally {
        setLoading(false);
        }
    };

    // Fetch current values on mount
    useEffect(() => {
        const fetchGroupWallet = async () => {
            try {
                const res = await getGroupWallet(groupId);
                console.log('res', res)
                const wallet = res.payload?.data;
                if (wallet) {
                    setFormData({
                        kegow_account: wallet.kegowAccount || "",
                        // kegow_account_id: wallet.kegowAccountId || "",
                        kegow_account_name: wallet.kegowAccountName || "",
                        // kegow_data: wallet.kegowData ? JSON.stringify(wallet.kegowData) : "",
                        bank_code: wallet.bankCode || "",
                    });
                }
            } catch (err) {
                toastManager.addToast({
                    message: err.response?.data?.message || "Failed to fetch kegow settings",
                    type: "error",
                })
            }
        };

        if (groupId) fetchGroupWallet();
    }, [groupId]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Kegow Account Settings</h2>

      <form className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Kegow Account</label>
          <input
            type="text"
            name="kegow_account"
            value={formData.kegow_account}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <ValidationError message={validationErrors.kegow_account} field={"kegow_account"} />
        </div>

        {/* <div>
          <label className="block text-sm font-medium">Kegow Account ID</label>
          <input
            type="text"
            name="kegow_account_id"
            value={formData.kegow_account_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

        </div> */}

        <div>
          <label className="block text-sm font-medium">Kegow Account Name</label>
          <input
            type="text"
            name="kegow_account_name"
            value={formData.kegow_account_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <ValidationError message={validationErrors.kegow_account_name} field={"kegow_account_name"} />
        </div>

        {/* <div>
          <label className="block text-sm font-medium">
            Kegow Data (JSON)
          </label>
          <textarea
            name="kegow_data"
            value={formData.kegow_data}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder='e.g. {"extra":"data"}'
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium">Bank Code</label>
          <input
            type="text"
            name="bank_code"
            value={formData.bank_code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <ValidationError message={validationErrors.bank_code} field={"bank_code"} />
        </div>

        <Button children={loading ? "Saving..." : "Save Changes"} type={"button"} className={"primary"} onClick={handleSubmit} disabled={loading}/>

        {/* <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button> */}
      </form>
    </div>
  );
};

export default KegowAccountSettings;
