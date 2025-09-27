import "./Admin.update.society.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useGetSociety,
  useUpdateSociety,
  useCreateContribution,
  useGetContributions,
  useUpdateContribution,
  useDeleteContribution
} from "../../redux/actions/societyAction";
import toastManager from "../../components/ui/toast/ToasterManager";
import { ClipLoader } from "react-spinners";
import Loading from "../../components/splash/loading/Loading";
import {runValidation} from '../../utils/buchi';
import ValidationError from '../../components/ui/form-elements/ValidaionError';
import Modal from "../../components/ui/modal/Modal";
import { formatDateStringToHtmlDate } from "../../utils/time";
import KegowAccountSettings from "../system.setting/KegowSettings";
import ContributionForm from "./ContributionForm";
import { ConfigContext } from '../../context/ConfigProvider';


function AdminUpdateSociety() {

  const getSociety = useGetSociety();
  const updateSociety = useUpdateSociety();
  const createContribution = useCreateContribution();
  const getContributions = useGetContributions();
  const updateContribution = useUpdateContribution();
  const deleteContribution = useDeleteContribution();

  const { societyId } = useParams();

  const navigate = useNavigate();

  
  const { config } = useContext(ConfigContext);
  const thriftFrequency = config?.settings?.union?.thriftFrequency || "weekly";

  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [society, setSociety] = useState();

  const [newContribution, setNewContribution] = useState({
    title:"",
    startDate: "",
    endDate: "",
    deadline: "",
    minAmount: "",
    status:"inactive"
  });
  const [validationErrors, setValidationErrors] = useState();
  const [allContributionProgram, setAllContributionProgram] = useState([]);
  const [programEditModalIsOpen, setProgramEditModalIsOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState({
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    start_date:"",
    end_date:"",
    deadline: "",
    minAmount: "",
    status:""
  });

  const handleUpdateSociety = async () => {
    setLoading(true);
    try {
      const response = await updateSociety({
        name,
        description,
        entranceFee,
        isActive,
        societyId
      });
      // console.log(response);
      
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName("");
        setDescription("");
        setEntranceFee("");
        setIsActive(true);
        toastManager.addToast({
          message: "Society updated successfully",
          type: "success",
        });
        navigate(-1);
        return;
      } else {
        setErrorMessage(response?.message);
      }
    } catch (error) {
      setErrorMessage(error?.response?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSociety = async () => {
    setLoadingInit(true);

    try {
      const response = await getSociety(societyId);
      // console.log(response);
      
      if (
        response?.payload.status === true ||
        response?.payload.status === "success"
      ) {
        setErrorMessage("");
        setName(response.payload.data.name);
        setDescription(response.payload.data.description);
        setEntranceFee(response.payload.data.entranceFee);
        setSociety(response.payload.data)
        return;
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response.message);
    } finally {
      setLoadingInit(false);
    }
  };

  const validateUpdateForm = async () => {
    
    const validate = await runValidation([
        {
          input: { value: entranceFee, field: "entrance_fee", type: "number" },
          rules: { required: true },
        },
        {
            input: { value: name, field: "name", type: "text" },
            rules: { required: true },
        },
        {
            input: { value: description, field: "description", type: "text" },
            rules: { required: true, min_length:20, },
        },
        
    ]);

    if (validate?.status === false) {
        
        setValidationErrors(validate.errors);
    } else {
      // alert("kkkkkk")
      handleUpdateSociety();
    }
  }

  /*const validateContributionForm = async () => {
    setValidationErrors([]);
    const validate = await runValidation([
        {
          input: { value: newContribution.title, field: "title", type: "text" },
          rules: { required: true },
        },
        {
            input: { value: newContribution.deadline, field: "weekly_deadline", type: "text" },
            rules: { required: true },
        },
        {
          input: { value: newContribution.minAmount, field: "minimum_amount", type: "text" },
          rules: { required: true },
        },
        {
          input: { value: newContribution.startDate, field: "start_date", type: "text" },
          rules: { required: true },
        },
        {
            input: { value: newContribution.endDate, field: "end_date", type: "text" },
            rules: { required: true },
        },
        {
          input: { value: newContribution.status, field: "status", type: "text" },
          rules: { required: true },
        },
        
    ]);

    if (validate?.status === false) {
        
        setValidationErrors(validate.errors);
    } else {
      // alert("kkkkkk")
      createNewContribution();
    }
  }*/



  const validateContributionForm = async () => {
  setValidationErrors([]);
  const rules = [
    {
      input: { value: newContribution.title, field: "title", type: "text" },
      rules: { required: true },
    },
    {
      input: { value: newContribution.minAmount, field: "minAmount", type: "text" },
      rules: { required: true },
    },
    {
      input: { value: newContribution.startDate, field: "startDate", type: "text" },
      rules: { required: true },
    },
    {
      input: { value: newContribution.endDate, field: "endDate", type: "text" },
      rules: { required: true },
    },
    {
      input: { value: newContribution.status, field: "status", type: "text" },
      rules: { required: true },
    },
  ];

  // add frequency-specific validations
  switch ((config?.settings?.union?.thriftFrequency || "weekly").toLowerCase()) {
    case "weekly":
      rules.push({
        input: { value: newContribution.deadline, field: "deadline", type: "text" },
        rules: { required: true },
      });
      break;

    case "daily":
      rules.push({
        input: { value: newContribution.deadline, field: "deadline", type: "text" },
        rules: { required: true },
      });
      break;

    case "monthly":
      rules.push(
        {
          input: { value: newContribution.deadline, field: "deadline", type: "number" },
          rules: { required: true },
        },
        {
          input: { value: newContribution.deadline, field: "deadline", type: "text" },
          rules: { required: true },
        }
      );
      break;
    default:
      break;
  }

  const validate = await runValidation(rules);

  if (validate?.status === false) {
    setValidationErrors(validate.errors);
  } else {
    createNewContribution();
  }
};

  const validateUpdateContributionForm = async () => {
    setValidationErrors([]);
    const validate = await runValidation([
        {
          input: { value: programToEdit.title, field: "title", type: "text" },
          rules: { required: true },
        },
        {
            input: { value: programToEdit.deadline, field: "deadline", type: "text" },
            rules: { required: true },
        },
        {
          input: { value: programToEdit.minAmount, field: "minimum_amount", type: "text" },
          rules: { required: true },
        },
        {
          input: { value: programToEdit.startDate, field: "start_date", type: "text" },
          rules: { required: true },
        },
        {
            input: { value: programToEdit.endDate, field: "end_date", type: "text" },
            rules: { required: true },
        },
        {
          input: { value: programToEdit.status, field: "status", type: "text" },
          rules: { required: true },
        },
        
    ]);

    console.log('validation')
    console.log(validate)
    if (validate?.status === false) {
        
        setValidationErrors(validate.errors);
    } else {
      handleUpdateContribution();
    }
  }

  const createNewContribution = async () => {
    
    const data = { ...newContribution, groupId: societyId };
    try {
      setLoading(true)
      const response = await createContribution(data);
      console.log(response);
      setLoading(false);

      if(response?.payload.status == "success"){
        toastManager.addToast({
          message: response.payload?.message,
          type: "success",
        });
        setNewContribution({
          title: "",
          deadline: "",
          minAmount: "",
          startDate: "",
          endDate: "",
          status: "",
        });
        fetchContributions();
      }else{
        toastManager.addToast({
            message:  response.payload.message ? response.payload.message: "Something went wrong",
            type: "error",
        });
      }
    } catch (error) {
        setLoading(false)
        toastManager.addToast({
          message: error.payload.message ? error.payload.message: "Something went wrong",
          type: "error",
      });
    } 
  }

  const fetchContributions = async () => {
    try {
      const response = await getContributions(societyId);
      console.log(response);
      
      if(response?.payload.status == "success" && response.payload?.data){
        setAllContributionProgram(response?.payload.data)
      }else{
        console.log(response);
      }   
    }catch (error) {
      console.log(error);
    }
  }
  
  const openEditModal = (e) => {
    const  targetProgram = allContributionProgram[e.target.getAttribute("data-id")];
    const  newProgramToEdit = {
      id:targetProgram.id,
      title:targetProgram.title,
      startDate: targetProgram.startDate,
      endDate: targetProgram.endDate,
      deadline: targetProgram.deadline,
      minAmount: targetProgram.minAmount,
      status: targetProgram.status
    }     
    setProgramToEdit(newProgramToEdit);
    setProgramEditModalIsOpen(true)
  }

  const handleUpdateContribution = async () => {
    const data = { ...programToEdit };
    try {
      const response = await updateContribution(data);
      console.log(response);
      
      if(response?.payload.status == "success"){
        toastManager.addToast({
          message: "Contribution Program updated successfully",
          type: "success",
        });
        setProgramEditModalIsOpen(false)
        fetchContributions();
      }else{
        console.log(response);
      }   
    }catch (error) {
      console.log(error);
    }
  }

  const handleDeleteContribution = async (id) => {
    try {
      const response = await deleteContribution({id});
      console.log(response);
      
      if(response?.payload.status === "success"){
        toastManager.addToast({
          message: "Contribution Program deleted successfully",
          type: "success",
        });
        // setProgramEditModalIsOpen(false)
        fetchContributions();
      }else{
        console.log(response);
        toastManager.addToast({
          message: response.payload || "Something went wrong",
          type: "error",
        });
      }   
    }catch (error) {
      console.log(error);
      toastManager.addToast({
          message: error.payload || "Something went wrong",
          type: "error",
      });
      
    }
  }
  useEffect(() => {
    handleGetSociety();
    fetchContributions();
    
    //  ? config.settings.union.minimumThriftAmount:(config.settings.thriftControl === 'Society'? config.settings.union.minimumThriftAmount : ) ,
  }, []);

  useEffect(() => {
    console.log("society", society)

    let updated = { ...newContribution }

    if (config.settings.thriftControl === 'Union') {
      console.log("min thrift using union", config.settings?.union?.minimumThriftAmount)
      updated.minAmount = config.settings?.union?.minimumThriftAmount
    }

    if (config.settings.thriftControl === 'Society') {
      console.log("min thrift using society", society?.minimumThriftAmount)
      updated.minAmount = society?.minimumThriftAmount
    }

    if (thriftFrequency === 'daily') {
      updated.deadline = "23:59"
    }

    setNewContribution(updated)
    console.log("thriftFrequency", thriftFrequency)
  }, [society, thriftFrequency, config.settings])

  

  return (
    <>
      {loadingInit ? (
        <Loading />
      ) : (
        <div className="create__society">
          <h1>Edit society</h1>
          <section className="edit__user__section1 create__society__wra">
            
              <div className="container bg-grey">
                {/* First Row: Name, Entrance Fee, Is Active */}
                <div className="row mb-3 px-2 py-3">
                  {/* Name */}
                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <ValidationError validationErrors={validationErrors} field="name" />
                    </div>
                    
                  </div>

                  {/* Entrance Fee */}
                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Entrance Fee</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={entranceFee}
                        onChange={(e) => setEntranceFee(e.target.value)}
                      />
                      <ValidationError validationErrors={validationErrors} field="entrance_fee" />
                    </div>
                  </div>

                  {/* Is Active */}
                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Is Active</label>
                      <select
                        className="form-select"
                        required
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                      >
                        <option value={null}>--</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 col-12 px-2">
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                      />
                      <ValidationError validationErrors={validationErrors} field="description" />
                    </div>
                  </div>
                  <div  className="mb-3 col-12 text-right">
                    <button disabled={loading} onClick={validateUpdateForm} className="btn btn-primary">
                      {loading ? <ClipLoader color="#fff" size={20} /> : "Save"}
                    </button>
                  </div>
                </div>
              </div>
          </section>
          <hr />

          <KegowAccountSettings groupId={societyId} />
          <hr />
          
          <h1>Contribution Settings</h1>
          {/* <section className="edit__user__section1 create__society__wra">
            
              <div className="container bg-grey">
                <div className="row mb-3 px-2 py-3">
                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        required
                        value={newContribution.title}
                        onChange={(e) => setNewContribution({ ...newContribution, title: e.target.value })}
                      />
                      <ValidationError validationErrors={validationErrors} field="title" />
                    </div>
                    
                  </div>

                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Weekly Deadlines</label>
                      <select
                        name="deadline"
                        className="form-select"
                        defaultValue={newContribution.deadline}
                        aria-required
                        onChange={(e) => setNewContribution({ ...newContribution, deadline: e.target.value })}
                      >
                        <option value={null}>--</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                      <ValidationError validationErrors={validationErrors} field="weekly_deadline" />
                    </div>
                  </div>

                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        required
                        defaultValue="{newContribution.status}"
                        onChange={(e) => setNewContribution({ ...newContribution, status: e.target.value })}
                      >
                        <option value={null}>--</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <ValidationError validationErrors={validationErrors} field="status" />
                    </div>
                  </div>

                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Minimum Amount</label>
                      <input
                        type="number"
                        name="minimum_amount"
                        className="form-control"
                        required
                        value={newContribution.minAmount}
                        step={50}
                        onChange={(e) => setNewContribution({ ...newContribution, minAmount: e.target.value })}
                      />
                      <ValidationError validationErrors={validationErrors} field="minimum_amount" />
                    </div>
                    
                  </div>

                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        className="form-control"
                        required
                        value={newContribution.startDate}
                        onChange={(e) => setNewContribution({ ...newContribution, startDate: e.target.value })}
                      />
                      <ValidationError validationErrors={validationErrors} field="start_date" />
                    </div>
                    
                  </div>
                  <div className="col-md-4 px-2">
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        name="end_date"
                        className="form-control"
                        required
                        value={newContribution.endDate}
                        onChange={(e) => setNewContribution({ ...newContribution, endDate: e.target.value })}
                      />
                      <ValidationError validationErrors={validationErrors} field="end_date" />
                    </div>
                    
                  </div>

                  <div  className="mb-3 col-12 text-right">
                    <button disabled={loading} onClick={validateContributionForm} className="btn btn-primary">
                      {loading ? <ClipLoader color="#fff" size={20} /> : "Save"}
                    </button>
                  </div>
                </div>
              </div>
          </section> */}
          <ContributionForm newContribution={newContribution} setNewContribution={setNewContribution} validateContributionForm={validateContributionForm} validationErrors={validationErrors} loading={loading}  thriftFrequency={thriftFrequency} />
          <hr />

          <section className="edit__user__section1 create__society__wra">
              <div className="container bg-grey society-setting">
                <div class="table-responsive-custom py-3">
                  <table class="table table-custom text-start table-hover">
                    <thead>
                      <tr class="text-start">
                        <th>Title</th>
                        <th>Min. Amount</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th> Deadlines</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allContributionProgram.map((contribution, index)=>(
                        <tr key={contribution.id}>
                          <td>{contribution.title}</td>
                          <td>N {contribution.minAmount}</td>
                          <td>{contribution.status}</td>
                          <td>{contribution.startDate}</td>
                          <td>{contribution.endDate}</td>
                          <td>{contribution.deadline}</td>
                          <td>
                            <button className="btn btn-primary me-2" data-id={index} onClick={(e)=>openEditModal(e)}> Edit</button>
                            <Link to={`/main/thrifts/${contribution.id}`} className="btn btn-primary">View Thrifts</Link>
                            <button className="btn btn-danger" onClick={()=>handleDeleteContribution(contribution.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      
                    </tbody>
                  </table>
                </div>
                    
              {/* <Modal isOpen={programEditModalIsOpen} onClose={()=>setProgramEditModalIsOpen(false)}>
                  <div className="modal__withdraw1">
                    <div className="row mb-3 px-2 py-3">
                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              name="title"
                              className="form-control"
                              required
                              value={programToEdit.title}
                              onChange={(e) => setProgramToEdit({ ...programToEdit, title: e.target.value })}
                            />
                            <ValidationError validationErrors={validationErrors} field="title" />
                          </div>
                          
                        </div>

                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">Weekly Deadlines</label>
                            <select
                              name="deadline"
                              className="form-select"
                              defaultValue={programToEdit.deadline}
                              aria-required
                              onChange={(e) => setProgramToEdit({ ...programToEdit, deadline: e.target.value })}
                            >
                              <option value={null}>--</option>
                              <option value="Sunday">Sunday</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                            <ValidationError validationErrors={validationErrors} field="weekly_deadline" />
                          </div>
                        </div>

                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                              name="status"
                              className="form-select"
                              required
                              defaultValue={programToEdit.status}
                              onChange={(e) => setProgramToEdit({ ...programToEdit, status: e.target.value })}
                            >
                              <option value={null}>--</option>
                              <option value="active">active</option>
                              <option value="inactive">inactive</option>
                            </select>
                            <ValidationError validationErrors={validationErrors} field="status" />
                          </div>
                        </div>

                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">Minimum Amount</label>
                            <input
                              type="number"
                              name="minimum_amount"
                              className="form-control"
                              required
                              value={programToEdit.minAmount}
                              step={50}
                              onChange={(e) => setProgramToEdit({ ...programToEdit, minAmount: e.target.value })}
                            />
                            <ValidationError validationErrors={validationErrors} field="minimum_amount" />
                          </div>
                          
                        </div>

                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              name="start_date"
                              className="form-control"
                              required
                              value={formatDateStringToHtmlDate(programToEdit.startDate)}
                              onChange={(e) => setProgramToEdit({ ...programToEdit, startDate: e.target.value })}
                            />
                            <ValidationError validationErrors={validationErrors} field="start_date" />
                          </div>
                          
                        </div>
                        <div className="col-md-4 px-2">
                          <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              name="end_date"
                              className="form-control"
                              required
                              value={formatDateStringToHtmlDate(programToEdit.endDate)}
                              onChange={(e) => setProgramToEdit({ ...programToEdit, endDate: e.target.value })}
                            />
                            <ValidationError validationErrors={validationErrors} field="end_date" />
                          </div>
                          
                        </div>

                        <div  className="mb-3 col-12 text-right">
                          <button disabled={loading} onClick={validateUpdateContributionForm} className="btn btn-primary">
                            {loading ? <ClipLoader color="#fff" size={20} /> : "Save"}
                          </button>
                        </div>
                      </div>
                  </div>
              </Modal> */}

              <Modal isOpen={programEditModalIsOpen} onClose={() => setProgramEditModalIsOpen(false)}>
                <div className="modal__withdraw1">
                  <div className="row mb-3 px-2 py-3">
                    {/* Title */}
                    <div className="col-md-4 px-2">
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          required
                          value={programToEdit.title || ""}
                          onChange={(e) =>
                            setProgramToEdit({ ...programToEdit, title: e.target.value })
                          }
                        />
                        <ValidationError validationErrors={validationErrors} field="title" />
                      </div>
                    </div>

                    {/* Deadline (varies by frequency) */}
                    <div className="col-md-4 px-2">
                      {(() => {
                        switch (thriftFrequency?.toLowerCase()) {
                          case "weekly":
                            return (
                              <div className="form-group">
                                <label className="form-label">Weekly Deadline</label>
                                <select
                                  name="deadline"
                                  className="form-select"
                                  value={programToEdit.deadline || ""}
                                  onChange={(e) =>
                                    setProgramToEdit({ ...programToEdit, deadline: e.target.value })
                                  }
                                >
                                  <option value="">--</option>
                                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                                    (day) => (
                                      <option key={day} value={day}>
                                        {day}
                                      </option>
                                    )
                                  )}
                                </select>
                                <ValidationError validationErrors={validationErrors} field="deadline" />
                              </div>
                            );

                          case "daily":
                            return (
                              <div className="form-group">
                                <label className="form-label">Deadline Time</label>
                                <input
                                  type="time"
                                  name="deadline"
                                  className="form-control"
                                  value={programToEdit.deadline || ""}
                                  onChange={(e) =>
                                    setProgramToEdit({ ...programToEdit, deadline: e.target.value })
                                  }
                                />
                                <ValidationError validationErrors={validationErrors} field="deadline" />
                              </div>
                            );

                          case "monthly":
                            return (
                              <>
                                <div className="form-group mb-2">
                                  <label className="form-label">Deadline Day of Month</label>
                                  <input
                                    type="number"
                                    name="deadline"
                                    min="1"
                                    max="31"
                                    className="form-control"
                                    value={programToEdit.deadline || ""}
                                    onChange={(e) =>
                                      setProgramToEdit({ ...programToEdit, deadline: e.target.value })
                                    }
                                  />
                                  <ValidationError validationErrors={validationErrors} field="deadline" />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Deadline Time</label>
                                  <input
                                    type="time"
                                    name="deadline"
                                    className="form-control"
                                    value={programToEdit.deadline || ""}
                                    onChange={(e) =>
                                      setProgramToEdit({ ...programToEdit, deadline: e.target.value })
                                    }
                                  />
                                  <ValidationError validationErrors={validationErrors} field="deadline" />
                                </div>
                              </>
                            );

                          default:
                            return null;
                        }
                      })()}
                    </div>

                    {/* Status */}
                    <div className="col-md-4 px-2">
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          name="status"
                          className="form-select"
                          required
                          value={programToEdit.status || ""}
                          onChange={(e) =>
                            setProgramToEdit({ ...programToEdit, status: e.target.value })
                          }
                        >
                          <option value="">--</option>
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                        <ValidationError validationErrors={validationErrors} field="status" />
                      </div>
                    </div>

                    {/* Minimum Amount */}
                    <div className="col-md-4 px-2">
                      <div className="form-group">
                        <label className="form-label">Minimum Amount</label>
                        <input
                          type="number"
                          name="minAmount"
                          className="form-control"
                          required
                          value={programToEdit.minAmount || ""}
                          step={50}
                          onChange={(e) =>
                            setProgramToEdit({ ...programToEdit, minAmount: e.target.value })
                          }
                        />
                        <ValidationError validationErrors={validationErrors} field="minAmount" />
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="col-md-4 px-2">
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          className="form-control"
                          required
                          value={formatDateStringToHtmlDate(programToEdit.startDate)}
                          onChange={(e) =>
                            setProgramToEdit({ ...programToEdit, startDate: e.target.value })
                          }
                        />
                        <ValidationError validationErrors={validationErrors} field="startDate" />
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="col-md-4 px-2">
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          className="form-control"
                          required
                          value={formatDateStringToHtmlDate(programToEdit.endDate)}
                          onChange={(e) =>
                            setProgramToEdit({ ...programToEdit, endDate: e.target.value })
                          }
                        />
                        <ValidationError validationErrors={validationErrors} field="endDate" />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="mb-3 col-12 text-right">
                      <button
                        disabled={loading}
                        onClick={validateUpdateContributionForm}
                        className="btn btn-primary"
                      >
                        {loading ? <ClipLoader color="#fff" size={20} /> : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>

              </div>
          </section>
        </div>

      )}
    </>
  );
}

export default AdminUpdateSociety;
