import React, { useContext, useEffect } from "react";
import { ConfigContext } from '../../context/ConfigProvider';
import ClipLoader from "react-spinners/ClipLoader";
import ValidationError from "../../components/ui/form-elements/ValidaionError";

const ContributionForm = ({
  newContribution,
  setNewContribution,
  validateContributionForm,
  validationErrors,
  loading,
  thriftFrequency
}) => {
  const { config } = useContext(ConfigContext);
 

  const renderDeadlineField = () => {
    switch (thriftFrequency.toLowerCase()) {
      case "weekly":
        return (
          <div className="form-group">
            <label className="form-label">Weekly Deadline</label>
            <select
              name="deadline"
              className="form-select"
              value={newContribution.deadline || ""}
              onChange={(e) =>
                setNewContribution({ ...newContribution, deadline: e.target.value })
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
              name="deadlineTime"
              className="form-control"
              value={newContribution.deadline || ""}
              onChange={(e) =>
                setNewContribution({ ...newContribution, deadline: e.target.value })
              }
            />
            <ValidationError validationErrors={validationErrors} field="deadlineTime" />
          </div>
        );

      case "monthly":
        return (
          <>
            <div className="form-group mb-2">
              <label className="form-label">Deadline Day of Month</label>
              <input
                type="number"
                name="deadlineDay"
                min="1"
                max="31"
                className="form-control"
                value={newContribution.deadline || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, deadline: e.target.value })
                }
              />
              <ValidationError validationErrors={validationErrors} field="deadlineDay" />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline Time</label>
              <input
                type="time"
                name="deadlineTime"
                className="form-control"
                value={newContribution.deadlineTime || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, deadlineTime: e.target.value })
                }
              />
              <ValidationError validationErrors={validationErrors} field="deadlineTime" />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  

  return (
    <section className="edit__user__section1 create__society__wra">
      <div className="container bg-grey">
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
                value={newContribution.title || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, title: e.target.value })
                }
              />
              <ValidationError validationErrors={validationErrors} field="title" />
            </div>
          </div>

          {/* Deadline (varies by frequency) */}
          <div className="col-md-4 px-2">{renderDeadlineField()}</div>

          {/* Status */}
          <div className="col-md-4 px-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                required
                value={newContribution.status || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, status: e.target.value })
                }
              >
                <option value="">--</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                value={newContribution.minAmount || ""}
                disabled={newContribution.minAmount !== ""}
                step={50}
                onBlur={(e) =>
                  setNewContribution({ ...newContribution, minAmount: e.target.value })
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
                value={newContribution.startDate || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, startDate: e.target.value })
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
                value={newContribution.endDate || ""}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, endDate: e.target.value })
                }
              />
              <ValidationError validationErrors={validationErrors} field="endDate" />
            </div>
          </div>

          {/* Save Button */}
          <div className="mb-3 col-12 text-right">
            <button
              disabled={loading}
              onClick={validateContributionForm}
              className="btn btn-primary"
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContributionForm;
