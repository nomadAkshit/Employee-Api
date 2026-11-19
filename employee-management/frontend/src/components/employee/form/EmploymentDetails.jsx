
function EmploymentDetails({
    employmentType,
    setEmploymentType,
    joiningDate,
    setJoiningDate,
    employmentStatus,
    setEmploymentStatus,
    reportingManager,
    setReportingManager,
}) {
    return (
        <div className="profile-section">

            <div className="profile-section-header">
                <span>03</span>
                <h3>Employment Details</h3>
            </div>

            <div className="profile-grid">

                {/* Employment Type */}
                <div className="form-group">
                    <label>Employment Type</label>
                    <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                    </select>
                </div>

                {/* Joining Date */}
                <div className="form-group">
                    <label>Joining Date</label>
                    <input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                    />
                </div>

                {/* Employment Status */}
                <div className="form-group">
                    <label>Employment Status</label>
                    <select
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>

                {/* Reporting Manager */}
                <div className="form-group">
                    <label>Reporting Manager</label>
                    <input
                        type="text"
                        placeholder="Enter reporting manager"
                        value={reportingManager}
                        onChange={(e) => setReportingManager(e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}

export default EmploymentDetails;
