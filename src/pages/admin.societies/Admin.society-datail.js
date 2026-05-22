import {useGetSocietyDetail} from "../../redux/actions/societyAction";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const SocietyDetailsScreen = () => {
     const getSociety = useGetSocietyDetail();
     const { groupId } = useParams();
    // state variables
    // const [name , setName] = useState('');
    // const [description , setDescription] = useState('');
    // const [entranceFee , setEntranceFee] = useState('');
    const [society , setSociety] = useState({});
     
    const handleGetSociety = async () => {

        try {
        const response = await getSociety(groupId);
        // console.log(response);
        
        if (
            response?.payload.status === true ||
            response?.payload.status === "success"
        ) {
            // setName(response.payload.data.name);
            // setDescription(response.payload.data.description);
            // setEntranceFee(response.payload.data.entranceFee);
            setSociety(response.payload.data)
            return;
        } else {
            console.log(response.message);
        }
        } catch (error) {
            console.log(error.response.message);
        } 
    };

    useEffect( () => {
        handleGetSociety();
    }, []);


  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#003399] mb-6">
        Society Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {/* Name */}
        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Society Name</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#003399] mt-1">
            {society?.name}
          </h2>
        </div>

        {/* Membership Count */}
        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Membership Count</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#003399] mt-1">
            {society?.userCount} Members
          </h2>
          <Link to={`/main/societies/${groupId}/members`} className="text-[#003399] underline">View Members</Link>
        </div>

        {/* Account Balance */}
        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Account Balance</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#003399] mt-1">
            ₦{society?.Wallet?.balance}
          </h2>
        </div>

        {/* Active Loans */}
        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Active Loans</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#ED6E0A] mt-1">
            {society?.activeLoanCount} Active Loans
          </h2>
          <Link to={`/main/loan-applications/${groupId}/approved`} className="text-[#003399] underline">View Active Loans</Link>
        </div>

        {/* Pending Loan Applications */}
        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Pending Loan Applications</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#ED6E0A] mt-1">
            {society?.pendingLoanCount} Pending
          </h2>
          <Link to={`/main/loan-applications/${groupId}/pending`} className="text-[#003399] underline">View Pending Loans</Link>
        </div>

        <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Thrift Programs</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#003399] mt-1">
            Contributions
          </h2>
          <Link
            to={`/main/societies/${groupId}/thrift-programs`}
            className="text-[#003399] underline"
          >
            Manage Thrift Programs
          </Link>
        </div>

         {/* <div className="bg-white border border-[#003399]/20 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Completed Loans</p>
          <h2 className="text-lg md:text-xl font-semibold text-[#ED6E0A] mt-1">
            {society?.pendingLoanCount} Completed
          </h2>
          <Link to={`/main/loan-applications/${groupId}/completed`} className="text-[#003399] underline">View Completed Loans</Link>
        </div> */}
      </div>

      {/* Detailed Section */}
      <div className="bg-white border border-[#003399]/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-[#003399] mb-4">
          Society Details
        </h3>

        <div className="space-y-3 text-gray-700">
          <p><span className="font-semibold">Name:</span> {society?.name}</p>
          <p><span className="font-semibold">Membership Count:</span> {society?.userCount}</p>
          <p><span className="font-semibold">Account Balance:</span> ₦{society?.Wallet?.balance}</p>
          <p><span className="font-semibold">Active Loans:</span> {society?.activeLoanCount}</p>
          <p><span className="font-semibold">Pending Loan Applications:</span> {society?.pendingLoanCount}</p>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetailsScreen;
