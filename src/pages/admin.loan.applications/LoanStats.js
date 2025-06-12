import { FaFile, FaFileExcel, FaFileImport } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useGetLoanCounts } from "../../redux/actions/applicationAction";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LoanStats = () => {
    const getLoanCounts = useGetLoanCounts();
    const { roles, user } = useSelector((state) => state.auth);
    const isSuperAdmin = roles?.includes("SuperAdmin");

    const [loanCounts, setLoanCounts] = useState({
        active:0,
        pending:0,
        rejected:0,
        inactive:0,
        total:0
    });

    const fetchLoanCounts = async () => {
        try {
            const loanCountParam = isSuperAdmin ? null : user.groupId
            const response = await getLoanCounts(loanCountParam);
            if (response?.payload.success === true || response?.payload.status === "success") {
                setLoanCounts(response.payload.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLoanCounts();
    }, []);
    return <section className="ad__student__app__section__one">
          <span className="ad__student__app__section__header">
            <h1>Loan application summary</h1>
            <select name="Timeline" id="Timeline">
              <option value={null}>This month</option>
              <option value="1">Last month</option>
              <option value="2">Last 6 months</option>
              <option value="3">Last 1 year</option>
            </select>
          </span>
          <article className="ad__student__app__section__article">
            <div className="ad__student__app__section__one__card">
              <FaFile className="ad__student__app__section__one__card__icon one" />
              <div>
                <h3>Total applications</h3>
                <h1>{loanCounts.total}</h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileCircleCheck className="ad__student__app__section__one__card__icon two" />
              <div>
                <h3>Approved applications</h3>
                <h1>
                  {loanCounts.active}
                </h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileImport className="ad__student__app__section__one__card__icon three" />
              <div>
                <h3>Pending applications</h3>
                <h1>
                  {loanCounts.pending}
                </h1>
              </div>
            </div>
            <div className="ad__student__app__section__one__card">
              <FaFileExcel className="ad__student__app__section__one__card__icon four" />
              <div>
                <h3>Rejected applications</h3>
                <h1>
                  {loanCounts.rejected}
                </h1>
              </div>
            </div>
          </article>
        </section>
};

export default LoanStats;