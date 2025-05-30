import "./Admin.thrifts.css";
import { useState, useEffect } from "react";
import {FaCircle} from 'react-icons/fa';
import { BiSearch } from "react-icons/bi";
import {ngDateTimeFormat, formatUnixToDate} from '../../utils/time';
import {useParams, Link} from 'react-router-dom';
import {useGetContributionThrifts} from '../../redux/actions/societyAction';

const Thrifts = () => {
    // state variables
    const [program, setProgram] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // redux hooks
    const getProgram = useGetContributionThrifts();

    // other hooks
    const { programId } = useParams();

    // custom variables
    const table_colors = [""]
    const filteredRecords = program.ThriftRecords?.filter((thrift) => {
        const userName = `${thrift.user?.firstName} ${thrift.user?.lastName}`.toLowerCase();
        const transactionAmount = thrift.transaction?.amount?.toString() || "";
        const transactionDate = thrift.transaction?.createdAt ? ngDateTimeFormat(thrift.transaction?.createdAt).toLowerCase() : "N/A";
        const dueDate = formatUnixToDate(thrift.dueDate).toLowerCase();
        const status = thrift.transaction?.status?.toLowerCase() || "";
    
        return (
          userName.includes(searchQuery) ||
          transactionAmount.includes(searchQuery) ||
          transactionDate.includes(searchQuery) ||
          dueDate.includes(searchQuery) ||
          status.includes(searchQuery)
        );
    });

    // custom functions
    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    

    // Api calls
    const fetchProgram = async () =>{
        setLoading(true);
        try{
          const response = await getProgram(programId);
          console.log(response);
          
          if (response?.payload.status === "success") {
            setProgram(response?.payload?.data)
          } else {
            setErrorMessage(response.message);
          }
        
        } catch (error) {
          setErrorMessage(error.response.message);
        } finally {
          setLoading(false);
        }
    };
      
      useEffect(()=>{
        
        fetchProgram()
      }, []);


    return (
        <div className="admin-table-body">
                
            <div  className="">
                <div className="admin-table">
                <div className="admin-table-header">
                    <div className="admin-table-cell">Title</div>
                    <div className="admin-table-cell">Min Amount</div>
                    <div className="admin-table-cell">Started on</div>
                    <div className="admin-table-cell">Ends on</div>
                    <div className="admin-table-cell">Weekly Deadlines</div>
                    <div className="admin-table-cell">Status </div>
                
                </div>
                
                </div>

                <div className="admin-table-row">
                <div className="admin-table-cell">{program.title}</div>
                <div className="admin-table-cell">{`${program.currency} ${program.minAmount}`}</div>
                <div className="admin-table-cell">{program.startDate}</div>
                <div className="admin-table-cell">{program.endDate}</div>
                <div className="admin-table-cell">{program.deadline}</div>
                <div className="admin-table-cell">
                    <span
                    style={{
                        border: `1px solid ${
                        program.status == "active" ? "#0BFD15" : "#dc143c"
                        }`,
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px 15px",
                        width: "max-content",
                    }}
                    >
                    <FaCircle
                        color={program.status == "active" ? "#0BFD15" : "#dc143c"}
                    />
                    {program.status}
                    </span>
                </div>
                </div>

                <h3> Thrift Payments</h3>
                <div className="dashboard__users__search">
                    <input
                        type="text"
                        placeholder="Search users..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input form-control"
                        style={{width:"300px"}}
                    />
                    <BiSearch className="admin__message__section__one__search__icon" />
                </div>
                <div className="admin-table">
                    <div className="admin-table-header">
                        <div className="admin-table-cell">Member</div>
                        <div className="admin-table-cell">Amount Paid</div>
                        <div className="admin-table-cell">Date Paid</div>
                        <div className="admin-table-cell">Due Date</div>
                        <div className="admin-table-cell">Lateness Fee (NGN)</div>
                        <div className="admin-table-cell">Action</div>
                    
                    </div>
                    
                </div>
                

        {filteredRecords?.map((thrift) => (
          <div className="admin-table-row" key={thrift.id} >
            <div className="admin-table-cell">
              <Link to={`/main/user/${thrift.user?.id}`} className="admin-table-cell__name">
                {`${thrift.user?.firstName} ${thrift.user?.lastName}`}
              </Link>
            </div>
            <div className="admin-table-cell">
              {thrift.transaction?.amount ? thrift.transaction?.amount : 0.00}
            </div>
            <div className="admin-table-cell">
              {thrift.transaction?.createdAt ? ngDateTimeFormat(thrift.transaction?.createdAt) : "N/A"}
            </div>
            <div className="admin-table-cell">
              {formatUnixToDate(thrift.dueDate)}
            </div>
            <div className="admin-table-cell">
              {thrift.transaction && thrift.transaction.status === 'success' ?
                thrift.fees?.length > 0 && thrift.fees.find((fee) => fee.type === "late_recurrent_payment") ? 
                  thrift.fees.find((fee) => fee.type === "late_recurrent_payment").amount :
                  "N/A" 
                :
                thrift.dueDate < Math.floor(Date.now() / 1000) ? 500 : "N/A"}
            </div>
            <div className="admin-table-cell">
              {!(thrift.transaction && thrift.transaction.status === 'success') ?
                
                <span className="status unpaid"  style={{
                    border: "1px solid #dc143c",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "10px 15px",
                    width: "max-content",
                }}>
                    Unpaid 
                    <FaCircle color={"#dc143c"}/>
                </span> :
                <span className="status paid"  style={{
                    border: "1px solid #0BFD15",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "10px 15px",
                    width: "max-content",
                }}>
                    Paid
                    <FaCircle  color={"#0BFD15"}/>
                </span>}
            </div>
          </div>
        ))}


                
            </div>
            
        </div>
    );
}

export default Thrifts