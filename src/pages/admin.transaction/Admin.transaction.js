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

function AdminTransaction() {
  const lastTransaction = useRef();

  const getTransactions = useGetTransactions();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

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

  const { totalCredit, totalDebit, overallSum } =
    calculateTransactionSums(transactions);

  const handleGetTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
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
  };

  useEffect(() => {
    handleGetTransactions();
  }, []);

  return (
    <>
      <div className="admin__transaction">
        <section className="admin__transaction__section__one">
          <span className="admin__transaction__section__header">
            <h1>Transaction summary</h1>
            <select name="Timeline" id="Timeline">
              <option value={null}>This month</option>
              <option value="1">Last month</option>
              <option value="2">Last 6 months</option>
              <option value="3">Last 1 year</option>
            </select>
          </span>
          <article className="admin__transaction__section__article">
            <div className="admin__transaction__section__one__card">
              <TbSum className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Total transactions</h3>
                <h1>₦ {overallSum}</h1>
              </div>
            </div>
            <div className="admin__transaction__section__one__card">
              <MdOutlineCallMissedOutgoing className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Outgoings</h3>
                <h1>₦ {totalDebit}</h1>
              </div>
            </div>
            <div className="admin__transaction__section__one__card">
              <MdOutlineCallReceived className="admin__transaction__section__one__card__icon" />
              <div>
                <h3>Incomings</h3>
                <h1>₦ {totalCredit}</h1>
              </div>
            </div>
          </article>
        </section>
        <section className="admin__transaction__section__two">
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

            <h1 className="admin__transaction__section__two__header__userid">
              Wallet ID
            </h1>
            <h1 className="admin__transaction__section__two__header__status">
              Status
            </h1>
          </div>
          {transactions.map((item, i) => {
            return (
              <div
                className="admin__transaction__section__two__entry"
                useRef={lastTransaction}
              >
                <h1 className="admin__transaction__section__two__entry__date">
                  {transactions[i].createdAt}
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
                  {transactions[i].description}
                </h1>

                <h1 className="admin__transaction__section__two__entry__userid">
                  {transactions[i].walletId}
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
        </section>
      </div>
    </>
  );
}

export default AdminTransaction;
