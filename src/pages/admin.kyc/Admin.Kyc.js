// import "./Admin.kyc.css";
import { useState, useEffect } from "react";
import { FaCircle } from 'react-icons/fa';
// import { BiSearch } from "react-icons/bi"; // uncomment if you add search back
// import { ngDateTimeFormat, formatUnixToDate } from '../../utils/time';
// import { useParams, Link } from 'react-router-dom';
import { useGetKycSubmissions, useUpdateKycStatus } from '../../redux/actions/kycAction';
import toastManager from "../../components/ui/toast/ToasterManager";

const Kyc = () => {
  const getKycSubmissions = useGetKycSubmissions();
  const updateKycStatus = useUpdateKycStatus();
  const [kycData, setKycData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Helper to safely extract user data whether it comes as 'User' (Legacy) or 'user' (Adonis)
  const getUser = (info) => info?.user || info?.User || {};
  const getRequirement = (info) => info?.KycRequirement || info?.requirement || info?.Requirement || {};
  
  const handleApprove = async (data) => {
    const user = getUser(data);
    console.log(`Approved KYC for ${user.firstName} ${user.lastName}`);
    try {
      // CRITICAL UPDATE: Pass the specific KYC record ID (data.id), not the User ID
      const response = await updateKycStatus({ id: data.id, status: "accepted", rejectionReason: "" });
      
      if (response?.payload?.status === 200 || response?.payload?.status === "success") {
        toastManager.addToast({ message: "Approved successfully", type: "success" });
        getSubmissions();
      } else {
        toastManager.addToast({ message: "Something went wrong", type: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = (data) => {
    setSelectedData(data);
    setRejectionReason('');
    setShowModal(true);
  };

  const submitRejection = async () => {
    const user = getUser(selectedData);
    try {
      console.log(`Rejected KYC for ${user.firstName} ${user.lastName} with reason: ${rejectionReason}`);
      // CRITICAL UPDATE: Pass the specific KYC record ID (selectedData.id)
      const response = await updateKycStatus({ id: selectedData.id, status: "rejected", rejectionReason });
      
      if (response?.payload?.status === 200 || response?.payload?.status === "success") {
        toastManager.addToast({ message: "Rejection successful", type: "success" });
        setShowModal(false);
        getSubmissions();
      } else {
        toastManager.addToast({ message: "Something went wrong", type: "error" });
        setShowModal(false);
      }
    } catch (error) {
      setShowModal(false);
    }
  };

  const getSubmissions = async () => {
    const response = await getKycSubmissions();
    if (response?.payload?.status === "success") {
      setKycData(response.payload.data);
    }
  };

  useEffect(() => {
    getSubmissions();
  }, []);

  return (
    <div style={{ padding: '2rem', background: '#f9f9f9', fontFamily: 'Arial' }}>
      <h1>KYC Submissions (Pending Review)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#eaeaea' }}>
            <th style={cellStyle}>Full Name</th>
            <th style={cellStyle}>Required Document</th>
            <th style={cellStyle}>Submitted Text</th>
            <th style={cellStyle}>Submitted File</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {kycData.map((info) => {
            const user = getUser(info);
            const requirement = getRequirement(info);

            return (
              <tr key={info.id}>
                <td style={cellStyle}>
                  {user.firstName} {user.lastName} <br/>
                  <small style={{color: 'gray'}}>{user.phone} | {user.email}</small>
                </td>
                
                {/* Dynamically show what step they are fulfilling */}
                <td style={cellStyle}>
                  <strong>{requirement.name || 'Unknown Step'}</strong>
                </td>
                
                {/* The text input (e.g., NIN number or BVN) */}
                <td style={cellStyle}>
                  {info.identificationDocument && info.identificationDocument !== 'Face Capture' 
                    ? info.documentIdentifier 
                    : <span style={{color: '#ccc'}}>N/A</span>}
                </td>
                
                {/* The file upload (e.g., Selfie or ID Card) */}
                <td style={cellStyle}>
                  {info.documentFile ? (
                    <a href={info.documentFile} target="_blank" rel="noopener noreferrer" style={{color: 'blue'}}>
                      View Document
                    </a>
                  ) : (
                    <span style={{color: '#ccc'}}>No File</span>
                  )}
                </td>

                <td style={cellStyle}>
                  {info.status === "pending" ? (
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button onClick={() => handleApprove(info)}>Approve</button>
                      <button onClick={() => handleReject(info)} className="btn-danger" style={{backgroundColor: 'red', color: 'white'}}>Reject</button>
                    </div>
                  ) : info.status === "rejected" ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      Rejected <FaCircle style={{ color: 'red' }} />
                    </div>
                  ) : (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      {/* Approved <FaCircle style={{ color: 'green' }} /> */}
                       <button onClick={() => handleApprove(info)}>Approve</button>
                      <button onClick={() => handleReject(info)} className="btn-danger">Revert</button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Reject KYC Step: {getRequirement(selectedData)?.name}</h2>
            <p>For {getUser(selectedData)?.firstName} {getUser(selectedData)?.lastName}</p>
            <textarea
              rows="4"
              style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
              placeholder="Enter reason for rejection (e.g., Image is too blurry)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="border"
            />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button onClick={() => setShowModal(false)} style={{ marginRight: 8 }}>Cancel</button>
              <button 
                onClick={submitRejection} 
                disabled={!rejectionReason.trim()} 
                className="btn-danger"
                style={{ backgroundColor: rejectionReason.trim() ? 'red' : '#ccc', color: 'white' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  textAlign: 'left',
};

const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
};

export default Kyc;