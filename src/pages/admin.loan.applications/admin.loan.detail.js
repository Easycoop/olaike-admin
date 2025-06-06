// import React from "react";
// import { Button } from "@/components/ui/button"; 
// import { MoreHorizontal } from "lucide-react";
import { formatUnixToDateTime, ngDateFormat } from "../../utils/time";
import { FaArrowLeft } from "react-icons/fa";

const statusStyles = {
  paid: "text-green-600 bg-green-100",
  overdue: "text-red-600 bg-red-100",
  unpaid: "text-yellow-600 bg-yellow-100",
};

const sumRepaymentTransactionsAmount = (transactions) => {
    return transactions.reduce((total, transaction) => {
        // transaction.transaction 
        return transaction.transaction ?  total + parseFloat(transaction.transaction?.amount) : total
    }, 0);
}

const schedules = [
  {
    id: 1,
    dueDate: "2025-06-10",
    weeklyAmount: 100,
    weeklyInterest: 10,
    amountPaid: 100,
    status: "paid",
    paidOn: "2025-06-10",
  },
  {
    id: 2,
    dueDate: "2025-06-17",
    weeklyAmount: 100,
    weeklyInterest: 10,
    amountPaid: 0,
    status: "unpaid",
    paidOn: null,
  },
  {
    id: 3,
    dueDate: "2025-06-03",
    weeklyAmount: 100,
    weeklyInterest: 10,
    amountPaid: 0,
    status: "overdue",
    paidOn: null,
  },
];

export default function LoanDetail({result, setPreviewPaymentSchedule}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 shadow rounded-xl">
        <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-[#003399] mb-4">
            Weekly Loan Repayment Schedule
            </h1>

            <button 
                  className="btn btn-primary flex items-center gap-2 justify-center"
                  onClick={() => setPreviewPaymentSchedule(false)}
                >
                 Go Back to Loan detail
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-[#6699FF]/20">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Weekly Amount
                </th>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Weekly Interest
                </th>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Amount Paid
                </th>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Paid On
                </th>
                {/* <th className="px-4 py-2 text-left font-semibold text-[#003399]">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.repaymentSchedule?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{formatUnixToDateTime(item.dueDate)}</td> 
                  <td className="px-4 py-2">₦{item.weeklyAmount.toLocaleString()}</td>
                  <td className="px-4 py-2">₦{item.weeklyInterest.toLocaleString()}</td>
                  <td className="px-4 py-2">₦{sumRepaymentTransactionsAmount(item.transactions)}</td>
                  <td className="px-4 py-2">
                    

                    {sumRepaymentTransactionsAmount(item.transactions) >= (parseFloat(item.weeklyAmount) + parseFloat(item.weeklyInterest)) ?
                        <span className={`px-1 overdue ${statusStyles.paid}`}>  Paid </span>  
                        : 
                        (item.transactions.length > 0)  ? 'Partly paid' :"unpaid"} 
                        {(item.dueDate < Date.now() / 1000) && sumRepaymentTransactionsAmount(item.transactions) < (parseFloat(item.weeklyAmount) + parseFloat(item.weeklyInterest)) && 
                        <><br /><span className={`px-1 overdue ${statusStyles.overdue}`}>  Overdue </span> </>
                    }
                  </td>
                  <td className="px-4 py-2">
                    {sumRepaymentTransactionsAmount(item.transactions) >= (parseFloat(item.weeklyAmount) + parseFloat(item.weeklyInterest)) 
                    ? ngDateFormat(item.transactions[item.transactions?.length -1]?.createdAt)  : "—"}
                    </td>
                  {/* <td className="px-4 py-2">{item.paidOn || "—"}</td> */}
                  {/* <td className="px-4 py-2 space-x-2">
                    <button className="bg-[#003399] text-white px-3 py-1 rounded hover:opacity-90">
                      Close
                    </button>
                    <button className="bg-[#ED6E0A] text-white px-3 py-1 rounded hover:opacity-90">
                      Message
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90">
                      Blacklist
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
