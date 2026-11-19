import "./EmployeeDetailsModal.css";

function EmployeeDetailsModal({ employee, onClose }) {
  if (!employee) return null;

  const {
    name,
    email,
    department,
    salary,
    phone,
    dateOfBirth,
    gender,
    permanentAddress = {},
    designation,
    employmentType,
    joiningDate,
    employmentStatus,
    reportingManager,
    bondDetails = {},
    profilePhoto,
  } = employee;

  const formatDate = (val) => {
    if (!val) return "—";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val).slice(0, 10);
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(val).slice(0, 10);
    }
  };

  const addressParts = [
    permanentAddress?.street,
    permanentAddress?.city,
    permanentAddress?.state,
    permanentAddress?.pincode,
  ].filter(Boolean);

  const photoUrl = profilePhoto
    ? profilePhoto.startsWith("http")
      ? profilePhoto
      : `http://localhost:5000${profilePhoto}`
    : null;

  return (
    <div className="emp-modal-overlay" onClick={onClose}>
      <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="emp-modal-header">
          <div className="emp-modal-header-info">
            <span className="emp-modal-badge">{department || "General"}</span>
            <h2 className="emp-modal-title">{name || "Employee Details"}</h2>
            <p className="emp-modal-subtitle">{designation || "No Designation"}</p>
          </div>
          <button
            type="button"
            className="emp-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="emp-modal-body">
          {/* Avatar / Photo + High-level highlights */}
          <div className="emp-modal-profile-strip">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="emp-modal-avatar"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="emp-modal-avatar-fallback">
                {(name || "E").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="emp-modal-strip-meta">
              <div className="emp-meta-item">
                <span className="emp-meta-label">Email</span>
                <span className="emp-meta-val">{email || "—"}</span>
              </div>
              <div className="emp-meta-item">
                <span className="emp-meta-label">Status</span>
                <span className={`emp-status-pill status-${(employmentStatus || "Active").toLowerCase().replace(/\s+/g, "-")}`}>
                  {employmentStatus || "Active"}
                </span>
              </div>
              <div className="emp-meta-item">
                <span className="emp-meta-label">Salary</span>
                <span className="emp-meta-val emp-salary-val">
                  {salary !== undefined && salary !== null && salary !== ""
                    ? `₹${Number(salary).toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Personal Info */}
          <div className="emp-modal-section">
            <h3 className="emp-section-heading">Personal Information</h3>
            <div className="emp-grid">
              <div className="emp-field">
                <span className="emp-label">Phone</span>
                <span className="emp-val">{phone || "—"}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Date of Birth</span>
                <span className="emp-val">{formatDate(dateOfBirth)}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Gender</span>
                <span className="emp-val">{gender || "—"}</span>
              </div>
              <div className="emp-field emp-field-full">
                <span className="emp-label">Permanent Address</span>
                <span className="emp-val">
                  {addressParts.length > 0 ? addressParts.join(", ") : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Employment Details */}
          <div className="emp-modal-section">
            <h3 className="emp-section-heading">Employment Details</h3>
            <div className="emp-grid">
              <div className="emp-field">
                <span className="emp-label">Department</span>
                <span className="emp-val">{department || "—"}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Designation</span>
                <span className="emp-val">{designation || "—"}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Employment Type</span>
                <span className="emp-val">{employmentType || "Full-time"}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Joining Date</span>
                <span className="emp-val">{formatDate(joiningDate)}</span>
              </div>
              <div className="emp-field">
                <span className="emp-label">Reporting Manager</span>
                <span className="emp-val">{reportingManager || "—"}</span>
              </div>
            </div>
          </div>

          {/* Section: Bond Details */}
          <div className="emp-modal-section">
            <h3 className="emp-section-heading">Bond Details</h3>
            {bondDetails && bondDetails.applicable ? (
              <div className="emp-grid">
                <div className="emp-field">
                  <span className="emp-label">Bond Status</span>
                  <span className="emp-val">{bondDetails.status || "Active"}</span>
                </div>
                <div className="emp-field">
                  <span className="emp-label">Bond Amount</span>
                  <span className="emp-val">
                    {bondDetails.bondAmount
                      ? `₹${Number(bondDetails.bondAmount).toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="emp-field">
                  <span className="emp-label">Start Date</span>
                  <span className="emp-val">{formatDate(bondDetails.startDate)}</span>
                </div>
                <div className="emp-field">
                  <span className="emp-label">End Date</span>
                  <span className="emp-val">{formatDate(bondDetails.endDate)}</span>
                </div>
              </div>
            ) : (
              <p className="emp-no-bond">No employment bond applicable.</p>
            )}
          </div>
        </div>

        <div className="emp-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailsModal;

