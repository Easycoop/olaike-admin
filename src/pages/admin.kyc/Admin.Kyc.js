// import "./Admin.kyc.css";
import { useState, useEffect } from "react";
import {FaCircle} from 'react-icons/fa';
import { BiSearch } from "react-icons/bi";
import {ngDateTimeFormat, formatUnixToDate} from '../../utils/time';
import {useParams, Link} from 'react-router-dom';
import {useGetKycSubmissions, useUpdateKycStatus} from '../../redux/actions/kycAction';
import toastManager from "../../components/ui/toast/ToasterManager";

const Kyc = () => {


  const getKycSubmissions = useGetKycSubmissions();
  const updateKycStatus = useUpdateKycStatus();
  const [kycData, setKycData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleApprove = async(data) => {
    console.log(`Approved KYC for ${data?.User?.firstName} ${data?.User?.lastName}`);
    try {
      console.log(`Rejected KYC for ${data?.User?.firstName} ${data?.User?.lastName} with reason: ${rejectionReason}`);
      const response = await updateKycStatus({id: data?.User?.id, status:"accepted", rejectionReason:""});
        if (
          response?.payload.status === 200 ||
          response?.payload.status === "success"
        ) {
          toastManager.addToast({
            message: "Approved successfully",
            type: "success",
          });
          // setShowModal(false);
          getSubmissions();
          return;
        } else {
          toastManager.addToast({
            message: "Something went wrong",
            type: "error",
          });
          // setShowModal(false)
        }
        // API call can go here
        // setShowModal(false);
      } catch (error) {
        console.log(error);
        
        // setShowModal(false)
      }
  };

  const handleReject = (data) => {
    setSelectedData(data);
    setRejectionReason('');
    setShowModal(true);
  };

  const submitRejection = async () => {
    try {
      console.log(`Rejected KYC for ${selectedData?.User?.firstName} ${selectedData?.User?.lastName} with reason: ${rejectionReason}`);
      const response = await updateKycStatus({id: selectedData?.User?.id, status:"rejected", rejectionReason});
      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        toastManager.addToast({
          message: "Rejection successful",
          type: "success",
        });
        setShowModal(false);
        getSubmissions();
        return;
      } else {
        toastManager.addToast({
          message: "Somehting went wrong",
          type: "error",
        });
        setShowModal(false)
      }
      // API call can go here
      setShowModal(false);
    } catch (error) {
      setShowModal(false)
    }
    
  };

  const getSubmissions = async () => {
    const response = await getKycSubmissions();
    if (response?.payload.status === "success") {
      setKycData(response.payload.data);
    }
  }

  

      useEffect(()=>{
        
        getSubmissions();
      }, []);


    return (
      <div style={{ padding: '2rem', background: '#f9f9f9', fontFamily: 'Arial' }}>
      <h1>KYC Submissions</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#eaeaea' }}>
            <th style={cellStyle}>Full Name</th>
            <th style={cellStyle}>Phone</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>NIN</th>
            <th style={cellStyle}>NIN Slip</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {kycData.map((info) => (
            <tr key={info.id}>
              <td style={cellStyle}>{info?.User?.firstName} {info?.User?.lastName}</td>
              <td style={cellStyle}>{info?.User?.phone}</td>
              <td style={cellStyle}>{info?.User?.email}</td>
              <td style={cellStyle}>{info?.documentIdentifier}</td>
              <td style={cellStyle}>
                <a href={info?.documentFile} target="_blank" rel="noopener noreferrer">View</a>
              </td>
              <td style={cellStyle}>
                {info.status === "pending" ?
                  <>
                    <button onClick={() => handleApprove(info)} style={{ marginRight: 8 }}>Approve</button>
                    <button onClick={() => handleReject(info)} className="btn-danger">Reject</button>
                  </>
                  :
                  info.status === "rejected" ?
                  <>
                  Rejected 
                  <FaCircle style={{ color: 'red' }} />
                  </>
                   
                  :
                  <>
                  Approved 
                  <FaCircle style={{ color: 'green' }} /> 
                  </>
                  
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Reject KYC - {selectedData?.User?.firstName} {selectedData?.User?.lastName}</h2>
            <textarea
              rows="4"
              style={{ width: '100%', padding: '0.5rem' }}
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button onClick={() => setShowModal(false)} style={{ marginRight: 8 }} >Go Back</button>
              <button onClick={submitRejection} disabled={!rejectionReason.trim()} className="btn-danger">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
}

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