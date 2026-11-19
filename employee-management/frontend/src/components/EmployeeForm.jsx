
import BasicInformation from "./employee/form/BasicInformation.jsx";
import PersonalDetails from "./employee/form/PersonalDetails.jsx";
import EmploymentDetails from "./employee/form/EmploymentDetails.jsx";
import EmploymentBond from "./employee/form/EmploymentBond.jsx";
import SalaryDetails from "./employee/form/SalaryDetails.jsx";

function EmployeeForm({
    // Basic information
    name,
    setName,
    email,
    setEmail,
    department,
    setDepartment,
    designation,
    setDesignation,

    // Personal details
    phone,
    setPhone,
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    permanentAddress,
    setPermanentAddress,

    // Profile photo
    profilePhotoPreview,
    setProfilePhotoFile,

    // Employment details
    employmentType,
    setEmploymentType,
    joiningDate,
    setJoiningDate,
    employmentStatus,
    setEmploymentStatus,
    reportingManager,
    setReportingManager,

    // Bond details
    bondApplicable,
    setBondApplicable,
    bondStartDate,
    setBondStartDate,
    bondEndDate,
    setBondEndDate,
    bondAmount,
    setBondAmount,

    // Salary
    salary,
    setSalary,

    // Form actions
    editingId,
    loading,
    handleSubmit,
    cancelEdit,
    fieldErrors = {},
    clearFieldError = () => { },
}) {
    return (
        <section className="vintage-card profile-form-card">

            <h2>
                {editingId ? "Edit Employee Record" : "Add New Employee"}
            </h2>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="vintage-form profile-form"
            >

                {/* 01. Basic Information */}
                <BasicInformation
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    department={department}
                    setDepartment={setDepartment}
                    designation={designation}
                    setDesignation={setDesignation}
                    fieldErrors={fieldErrors}
                    clearFieldError={clearFieldError}
                />

                {/* 02. Personal Details */}
                <PersonalDetails
                    phone={phone}
                    setPhone={setPhone}
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                    gender={gender}
                    setGender={setGender}
                    permanentAddress={permanentAddress}
                    setPermanentAddress={setPermanentAddress}
                    profilePhotoPreview={profilePhotoPreview}
                    setProfilePhotoFile={setProfilePhotoFile}
                />

                {/* 03. Employment Details */}
                <EmploymentDetails
                    employmentType={employmentType}
                    setEmploymentType={setEmploymentType}
                    joiningDate={joiningDate}
                    setJoiningDate={setJoiningDate}
                    employmentStatus={employmentStatus}
                    setEmploymentStatus={setEmploymentStatus}
                    reportingManager={reportingManager}
                    setReportingManager={setReportingManager}
                />

                {/* 04. Employment Bond */}
                <EmploymentBond
                    bondApplicable={bondApplicable}
                    setBondApplicable={setBondApplicable}
                    bondStartDate={bondStartDate}
                    setBondStartDate={setBondStartDate}
                    bondEndDate={bondEndDate}
                    setBondEndDate={setBondEndDate}
                    bondAmount={bondAmount}
                    setBondAmount={setBondAmount}
                />

                {/* 05. Salary Details */}
                <SalaryDetails
                    salary={salary}
                    setSalary={setSalary}
                    fieldErrors={fieldErrors}
                    clearFieldError={clearFieldError}
                />

                {/* Form Actions */}
                <div className="button-group profile-form-actions">

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
