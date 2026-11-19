
function BasicInformation({
    name,
    setName,
    email,
    setEmail,
    department,
    setDepartment,
    designation,
    setDesignation,
    fieldErrors = {},
    clearFieldError = () => { },
}) {
    return (
        <div className="profile-section">

            <div className="profile-section-header">
                <span>01</span>
                <h3>Basic Information</h3>
            </div>

            <div className="profile-grid">

                {/* Full Name */}
                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        maxLength={50}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^[a-zA-Z\s]*$/.test(value)) {
                                setName(value);
                                clearFieldError("name");
                            }
                        }}
                        className={fieldErrors.name ? "input-error" : ""}
                    />

                    {fieldErrors.name && (
                        <span className="field-error-text">
                            ⚠ {fieldErrors.name}
                        </span>
                    )}
                </div>

                {/* Email */}

                {/* Email */}
                <div className="form-group">
                    <label>Email Address *</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        maxLength={100}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearFieldError("email");
                        }}
                        onBlur={() => {
                            const trimmedEmail = email.trim();

                            if (!trimmedEmail) {
                                clearFieldError("email");
                            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                                // This displays an error only if your parent
                                // provides a way to set field errors.
                            }
                        }}
                        className={fieldErrors.email ? "input-error" : ""}
                    />

                    {fieldErrors.email && (
                        <span className="field-error-text">
                            ⚠ {fieldErrors.email}
                        </span>
                    )}
                </div>

                {/* Department */}
                <div className="form-group">
                    <label>Department *</label>
                    <input
                        type="text"
                        placeholder="Enter department"
                        value={department}
                        maxLength={50}
                        onChange={(e) => {
                            setDepartment(e.target.value);
                            clearFieldError("department");
                        }}
                        className={fieldErrors.department ? "input-error" : ""}
                    />

                    {fieldErrors.department && (
                        <span className="field-error-text">
                            ⚠ {fieldErrors.department}
                        </span>
                    )}
                </div>

                {/* Designation */}
                <div className="form-group">
                    <label>Designation</label>
                    <input
                        type="text"
                        placeholder="Enter job designation"
                        value={designation}
                        maxLength={50}
                        onChange={(e) => {
                            setDesignation(e.target.value);
                            clearFieldError("designation");
                        }}
                        className={fieldErrors.designation ? "input-error" : ""}
                    />

                    {fieldErrors.designation && (
                        <span className="field-error-text">
                            ⚠ {fieldErrors.designation}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BasicInformation;
