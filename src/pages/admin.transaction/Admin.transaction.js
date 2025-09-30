import "./Admin.transaction.css";
import { useEffect, useState } from "react";
import {
  MdOutlineCallMissedOutgoing,
  MdOutlineCallReceived,
} from "react-icons/md";
import { TbSum } from "react-icons/tb";
import { PiCircleFill } from "react-icons/pi";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTransactions } from "../../redux/actions/transactionAction";
import { formDateFormat, ngDateTimeFormat } from "../../utils/time";
import { exportToExcel } from "../../utils/file";
import { filterNestedFields } from "../../utils/generic";
import { useSelector } from "react-redux";
const {useGetSocieties} = require('../../redux/actions/societyAction');

function AdminTransaction() {
  const lastTransaction = useRef();

  const { roles, user } = useSelector((state) => state.auth);
  const isSuperAdmin = roles?.includes("SuperAdmin");

  const getTransactions = useGetTransactions();
  const getSocieties = useGetSocieties();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState("success");
  const [description, setDescription] = useState("all");
  const [societies, setSocieties] = useState([]);
  const [society, setSociety] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // default size
  const [totalPages, setTotalPages] = useState(1);
  const [creditSum, setCreditSum] = useState(0);
  const [debitSum, setDebitSum] = useState(0);
  // const [entries, setEntries] = useState(10);
  // const [netVolume, setNetVolume] = useState(creditSum - debitSum);

  function calculateTransactionSums(transactions) {
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === "credit") {
        totalCredit += amount;
      } else if (transaction.type === "debit") {
        totalDebit += amount;
      }
    });

    const overallSum = totalCredit - totalDebit;

    return {
      totalCredit: totalCredit.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      }),
      totalDebit: totalDebit.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      }),
      overallSum: overallSum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      }),
    };
  }

  const descriptionList = ["loan repayment", "loan_application", "extra savings", "	entrance fee", "fund wallet"]

  const { totalCredit, totalDebit, overallSum } =
    calculateTransactionSums(transactions);

  /*const handleGetTransactions = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = startDate && endDate ? await getTransactions({startDate, endDate, page, size}) : await getTransactions()
      if (response?.payload.status == "success") {
        setErrorMessage("");
        setTransactions(response.payload.data.result);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoading(false);
    }
  };*/

  const handleGetTransactions = async (page = 1, size = 10, status="success" ) => {
    setLoading(true);
    try {
      const response = await getTransactions({ startDate, endDate, page, size, status, society, description });
      
      if (response?.payload?.status === "success") {
        setErrorMessage("");
        setTransactions(response.payload.data.result);
        setCurrentPage(response.payload.data.currentPage);
        setTotalPages(response.payload.data.totalPages);
        setCreditSum(response.payload.data.totalCredits);
        setDebitSum(response.payload.data.totalDebits);
      } else {
        setErrorMessage(response.payload.message || "Failed to load transactions.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const handleExport = ()=>{
    exportToExcel(filterNestedFields(transactions, ["createdAt", "amount", "currency", "description", "metaData.from.senderName", "status", "type"]), `${process.env.REACT_APP_APP_NAME}-transactions.xlsx`)
  }

  const handleGetSocieties = async () => {
    try {
      const response = await getSocieties();

      if (
        response?.payload.status === 200 ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");

        setSocieties(response.payload.data.groups);
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
    }
  };
  
  useEffect(() => {
    handleGetTransactions(1, pageSize, status);
    handleGetSocieties();
  }, []);

  useEffect(() => {
    console.log(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <>
      <div className="admin__transaction">
        <section className="admin__transaction__section__one">
          <span className="admin__transaction__section__header">
            {/* <h1>Transaction summary</h1> */}
            <div className="row gap-2">
              <div className="col-4">
                <label>Entries</label>
                <select className="form-control" defaultValue={10} onChange={(e) => setPageSize(e.target.value)}>
                  
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={"all"}>All</option>
                </select>  
              </div>
              {
                isSuperAdmin &&
                <div className="col-4">
                <label>Society</label>
                <select className="form-control"  onChange={(e) => setSociety(e.target.value)}>
                  <option value={"all"}>All</option>
                  {
                    societies.map((society, index) => (
                      <option key={index} value={society.id}>{society.name}</option>
                    ))
                  }
                </select>  
              </div>
              }
              <div className="col-4">
                <label>Status</label>
                <select className="form-control" defaultValue={"success"} onChange={(e) => setStatus(e.target.value)}>
                  <option value={"all"}>All</option>
                  <option value={"success"}>Success</option>
                  <option value={"failed"}>Failed</option>
                  <option value={"pending"}>Pending</option>
                </select>  
              </div>
              <div className="col-4">
                <label>Description</label>
                <select className="form-control" defaultValue={"all"} onChange={(e) => setDescription(e.target.value)}>
                  <option value={"all"}>All</option>
                  {descriptionList.map((desc, index)=>(
                    <option key={index} value={desc}>{desc.replace('_', ' ')}</option>
                  ))}
                  
                  
                </select>  
              </div>
              <div className="col-4">
                <label>From</label>
                <input type="date" className="form-control" value={formDateFormat(startDate)} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="col-4">
                <label>To</label>
                <input type="date" className="form-control" value={formDateFormat(endDate)} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="col-4">
              {/* <label>To</label>  */}<br />
                <button className="btn btn-primary d-block" onClick={()=>{handleGetTransactions(1, pageSize, status)}}>Filter</button>
              </div>
            </div>
            
          </span>
          <article className="admin__transaction__section__article">
            <div className="admin__transaction__section__one__card">
              <TbSum className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Total transactions</h3>
                <h1>₦ {(creditSum - debitSum).toLocaleString("en-US", {minimumFractionDigits: 2,})}</h1>
              </div>
            </div>
            <div className="admin__transaction__section__one__card">
              <MdOutlineCallMissedOutgoing className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Outgoings</h3>
                <h1>₦ {debitSum.toLocaleString("en-US", {minimumFractionDigits: 2,})}</h1>
              </div>
            </div>
            <div className="admin__transaction__section__one__card">
              <MdOutlineCallReceived className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Incomings</h3>
                <h1>₦ {creditSum.toLocaleString("en-US", { minimumFractionDigits: 2, })}</h1>
              </div>
            </div>
          </article>
        </section>
        <section className="admin__transaction__section__two">
          <div className="admin__transaction__section__two__header text-right"><button className="btn btn-secondary" onClick={handleExport}>Export Data</button></div>
          <div className="admin__transaction__section__two__header">
            <h1 className="admin__transaction__section__two__header__date">
              Transaction date
            </h1>
            <h1 className="admin__transaction__section__two__header__invoice">
              Transaction ID
            </h1>
            <h1 className="admin__transaction__section__two__header__ammount">
              Amount
            </h1>
            <h1 className="admin__transaction__section__two__header__property">
              Description
            </h1>

            <h1 className="admin__transaction__section__two__header__property">
              Society
            </h1>

            <h1 className="admin__transaction__section__two__header__userid">
              Sender
            </h1>
            <h1 className="admin__transaction__section__two__header__status">
              Status
            </h1>
          </div>
          {transactions.length > 0 ?
          <>
            {transactions.map((item, i) => {
              return (
                <div
                  className="admin__transaction__section__two__entry"
                  ref={lastTransaction}
                >
                  <h1 className="admin__transaction__section__two__entry__date">
                    { ngDateTimeFormat(transactions[i].createdAt)}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__invoice">
                    {transactions[i].id}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__ammount">{`₦ ${transactions[
                    i
                  ].amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`}</h1>
                  <h1 className="admin__transaction__section__two__entry__property">
                    {transactions[i].description.replaceAll('_', ' ')}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__property">
                    {transactions[i].Group?.name}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__userid">
                    {transactions[i]?.metaData?.from?.senderName}
                  </h1>
                  <h1 className="admin__transaction__section__two__entry__status">
                    <span>
                      <PiCircleFill
                        className={
                          transactions[i].status == "successs"
                            ? "ad__student__app__section__two__entry__status__icon successsful"
                            : transactions[i].status == "failed"
                            ? "ad__student__app__section__two__entry__status__icon unsuccesssful"
                            : "ad__student__app__section__two__entry__status__icon"
                        }
                      />
                      {transactions[i].status}
                    </span>
                  </h1>
                </div>
              );
            })}
            <div className="pagination">
              <button
                onClick={() => handleGetTransactions(currentPage - 1, pageSize, status)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handleGetTransactions(currentPage + 1, pageSize, status)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
          
          
          :
            <h3 className="text-danger text-center mt-3">No transaction found</h3>
          }
        </section>
      </div>
    </>
  );
}

export default AdminTransaction;
