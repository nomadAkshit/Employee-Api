
function SalaryDetails({
    salary,
    setSalary,
    fieldErrors = {},
    clearFieldError = () => { },
}) {
    return (
        <div className="profile-section">

            <div className="profile-section-header">
                <span>05</span>
                <h3>Salary Details</h3>
            </div>

            <div className="profile-grid">

                <div className="form-group">
                    <label>Salary (₹) *</label>

                    <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Enter salary in ₹"
                        value={salary}
                        onChange={(e) => {
                            setSalary(e.target.value);
                            clearFieldError("salary");
                        }}
                        className={fieldErrors.salary ? "input-error" : ""}
                    />

                    {fieldErrors.salary && (
                        <span className="field-error-text">
                            ⚠ {fieldErrors.salary}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SalaryDetails;
