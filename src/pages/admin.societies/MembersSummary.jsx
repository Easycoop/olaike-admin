import { useEffect, useRef } from "react";
import {filterNestedFields} from "../../utils/generic";
import { exportToExcel } from "../../utils/file";
import * as XLSX from "xlsx";

const MembersSummary = ({ members = [] }) => {
    const tableRef = useRef(null);
    const handleExport = ()=>{
        if (!tableRef.current) return;

        const workbook = XLSX.utils.table_to_book(tableRef.current, {
        sheet: "Members Summary",
        });

        XLSX.writeFile(workbook, "society_members_summary.xlsx");
        // exportToExcel(filterNestedFields(members, ["firstName", "lastName", "Wallet.SubWallets.find(sWallet => sWallet.name === 'Thrift').balance", "Wallet.SubWallets.find(sWallet => sWallet.name === 'Loan').balance", "Wallet.balance"]), `${process.env.REACT_APP_APP_NAME}-members.xlsx`)

    }

    // const exportToExcel = () => {
    //     if (!tableRef.current) return;

    //     const workbook = XLSX.utils.table_to_book(tableRef.current, {
    //     sheet: "Members Summary",
    //     });

    //     XLSX.writeFile(workbook, "society_members_summary.xlsx");
    // };

    useEffect(() => {
        console.log("Members data:", members);
    }, [members]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-[#003399]">
          Society Members Summary
        </h2>
        <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
            Overview of members’ thrift, loan and wallet balances
            </p>
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-[#003399] text-white text-xs sm:text-sm rounded-md hover:bg-[#002080] transition"
          >
            Export to Excel
          </button>
        </div>
       
      </div>

      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm" ref={tableRef}>
          <thead>
            <tr className="bg-[#003399]/5 text-[#003399]">
              <th className="px-3 py-2 text-left font-medium">S/N</th>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-right font-medium">Thrift Balance (₦)</th>
              <th className="px-3 py-2 text-right font-medium">Loan Balance (₦)</th>
              <th className="px-3 py-2 text-right font-medium">Wallet Balance (₦)</th>
            </tr>
          </thead>

          <tbody>
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr
                  key={member.id || index}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </td>

                  <td className="px-3 py-2 text-right text-gray-700">
                    {member.Wallet?.SubWallets?.find(sWallet => sWallet.name === "Thrift")?.balance?.toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right text-[red] font-medium">
                    {member.Wallet?.SubWallets?.find(sWallet => sWallet.name === "Loan")?.balance?.toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right text-green-600 font-medium">
                    {member.Wallet?.balance?.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400 text-sm">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersSummary;
