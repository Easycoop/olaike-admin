
import { PiCircleFill } from "react-icons/pi";
import { ngDateFormat } from "../../utils/time";
import LoanStats from "./LoanStats";


const LoanApplicationList = ({ result, navigate, status, loading, statusMap }) => {
    
   return (
    <>
      <div className="ad__student__app">
        <LoanStats />
        <section className="ad__student__app__section__two">
          <div className="ad__student__app__section__two__header">
            <h1 className="ad__student__app__section__two__header__date">
               Date Applied
            </h1>
            <h1 className="ad__student__app__section__two__header__id">
              Loan ID
            </h1>
            <h1 className="ad__student__app__section__two__header__university">
              Name
            </h1>
            <h1 className="ad__student__app__section__two__header__universityemail">
              Amount
            </h1>
            <h1 className="ad__student__app__section__two__header__university">
              Society
            </h1>

            <h1 className="ad__student__app__section__two__header__userid">
               Phone 
            </h1>
            <h1 className="ad__student__app__section__two__header__status">
              Status
            </h1>
          </div>
          {loading ? (
              <div className="loading">Loading...</div>
            ) : (
            result.length === 0 ? (
              <div className="no__data__found">No data found</div>
            ) :
            result.map((item, i) => {
                return (
                <div
                    key={i}
                    className="ad__student__app__section__two__entry"
                    onClick={() => {
                    navigate(`/main/loan-application/${item.id}`);
                    }}
                >
                    <h1 className="ad__student__app__section__two__entry__date">
                    {ngDateFormat(item.createdAt)}
                    </h1>
                    <h1 className="ad__student__app__section__two__entry__id">
                    {item.id}
                    </h1>
                    <h1 className="ad__student__app__section__two__entry__university">
                    {`${item.firstName} ${item.lastName}`}
                    </h1>
                    <h1 className="ad__student__app__section__two__entry__universityemail">
                    {item.amount}
                    </h1>
                    <h1 className="ad__student__app__section__two__entry__university">
                    {item.group?.name}
                    </h1>
                    <h1 className="ad__student__app__section__two__entry__userid">
                    {item.phone}
                    </h1>
                    <h1 className={`ad__student__app__section__two__entry__status flex justify-center text-center ${statusMap[status]['color']}`}>
                    <span>
                        <PiCircleFill
                        className="{statusMap[status]['color']}"
                        />{" "}
                        {item.status}
                    </span>
                    </h1>
                </div>
                );
            })
          )}
        </section>
      </div>
    </>
  );
}

export default LoanApplicationList;