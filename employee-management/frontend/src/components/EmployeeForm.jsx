function EmployeeForm({
    name,
    setName,
    email,
    setEmail,
    department,
    setDepartment,
    salary,
    setSalary,
    editingId,
    loading,
    handleSubmit,
    cancelEdit,
    fieldErrors = {},
    clearFieldError = () => {},
}) {
    return (
        <section className="vintage-card">
            <h2>
                {editingId ? "Edit Employee Record" : "Add New Employee"}
            </h2>

            <form onSubmit={handleSubmit} noValidate className="vintage-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            clearFieldError("name");
                        }}
                        className={fieldErrors.name ? "input-error" : ""}
                    />
                    {fieldErrors.name && (
                        <span className="field-error-text">⚠ {fieldErrors.name}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearFieldError("email");
                        }}
                        className={fieldErrors.email ? "input-error" : ""}
                    />
                    {fieldErrors.email && (
                        <span className="field-error-text">⚠ {fieldErrors.email}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Department</label>
                    <input
                        type="text"
                        placeholder="Enter department name"
                        value={department}
                        onChange={(e) => {
                            setDepartment(e.target.value);
                            clearFieldError("department");
                        }}
                        className={fieldErrors.department ? "input-error" : ""}
                    />
                    {fieldErrors.department && (
                        <span className="field-error-text">⚠ {fieldErrors.department}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Salary (₹)</label>
                    <input
                        type="number"
                        placeholder="Enter salary in ₹"
                        value={salary}
                        onChange={(e) => {
                            setSalary(e.target.value);
                            clearFieldError("salary");
                        }}
                        min="0"
                        step="any"
                        className={fieldErrors.salary ? "input-error" : ""}
                    />
                    {fieldErrors.salary && (
                        <span className="field-error-text">⚠ {fieldErrors.salary}</span>
                    )}
                </div>

                <div className="button-group">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : editingId
                                ? "Update Employee"
                                : "Add Employee"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default EmployeeForm;
