import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal.jsx";
import Navigation from "./components/Navigation.jsx";
import AlertMessage from "./components/AlertMessage.jsx";
import EmployeeForm from "./components/EmployeeForm.jsx";
import EmployeeDirectory from "./components/employee/EmployeeDirectory.jsx";
import { useAuth } from "./context/AuthContext";
import useEmployees from "./hooks/useEmployees";


function EmployeeDashboard() {
  const {
    employees,
    getEmployees,
    saveEmployee,
    removeEmployee
  } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  function openDetails(employee) {
    setSelectedEmployee(employee);
  }

  function closeDetails() {
    setSelectedEmployee(null);
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { user } = useAuth();

  // Personal details
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [permanentAddress, setPermanentAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Employment details
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [joiningDate, setJoiningDate] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("Active");
  const [reportingManager, setReportingManager] = useState("");

  // Bond details
  const [bondApplicable, setBondApplicable] = useState(false);
  const [bondStartDate, setBondStartDate] = useState("");
  const [bondEndDate, setBondEndDate] = useState("");
  const [bondAmount, setBondAmount] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");


  const isAdmin = user?.role === "admin";

  // Navigation tab: 'register' | 'directory'
  const [activeTab, setActiveTab] = useState(
    user?.role === "admin" ? "register" : "directory"
  );

  // Directory filter search
  const [searchFilter, setSearchFilter] = useState("");

  // Get employees from the backend
  useEffect(() => {
    if (!isAdmin) {
      setActiveTab("directory");
    }
  }, [isAdmin]);


  useEffect(() => {
    getEmployees().catch((err) => {
      setError(err.message);
    });
  }, [getEmployees]);


  function handleProfilePhotoSelection(file) {
    setProfilePhotoFile(file);

    if (profilePhotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file));
    } else {
      setProfilePhotoPreview(
        profilePhoto
          ? `http://localhost:5000${profilePhoto}`
          : ""
      );
    }
  }

  // Clear single field error when user starts typing
  function clearFieldError(field) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) {
      setError("");
    }
  }

  // Check if email already exists in the system
  function checkEmailDuplicate(emailValue) {
    if (!emailValue || !emailValue.trim()) return false;
    const normalized = emailValue.trim().toLowerCase();
    const exists = employees.some(
      (emp) =>
        emp.email &&
        emp.email.trim().toLowerCase() === normalized &&
        (emp._id || emp.id) !== editingId
    );

    if (exists) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "User email already exists",
      }));
      setError("User email already exists");
      return true;
    }
    return false;
  }

  // Add a new employee or update an existing one

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate required fields
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (checkEmailDuplicate(email)) {
      newErrors.email = "User email already exists";
    }

    if (!department.trim()) {
      newErrors.department = "Department is required";
    }

    if (
      salary === "" ||
      salary === null ||
      salary === undefined ||
      isNaN(Number(salary))
    ) {
      newErrors.salary = "Salary is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError(Object.values(newErrors)[0]);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // Create multipart form data
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("department", department.trim());
      formData.append("salary", String(Number(salary)));

      formData.append("phone", phone);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("gender", gender);

      formData.append(
        "permanentAddress",
        JSON.stringify(permanentAddress)
      );

      formData.append("designation", designation);
      formData.append("employmentType", employmentType);
      formData.append("joiningDate", joiningDate);
      formData.append("employmentStatus", employmentStatus);
      formData.append("reportingManager", reportingManager);

      formData.append(
        "bondDetails",
        JSON.stringify({
          applicable: bondApplicable,
          startDate: bondApplicable ? bondStartDate : "",
          endDate: bondApplicable ? bondEndDate : "",
          bondAmount: bondApplicable ? bondAmount : null,
          status: bondApplicable ? "Active" : "Not Applicable"
        })
      );

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const wasEditing = Boolean(editingId);

      // Save employee through the custom hook
      await saveEmployee(editingId, formData);

      // Only reset after successful save
      resetEmployeeForm();

      setSuccess(
        wasEditing
          ? "Employee updated successfully."
          : "Employee registered successfully."
      );

      if (wasEditing) {
        setActiveTab("directory");
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function resetEmployeeForm() {
    setName("");
    setEmail("");
    setDepartment("");
    setSalary("");

    setPhone("");
    setDateOfBirth("");
    setGender("");

    setPermanentAddress({
      street: "",
      city: "",
      state: "",
      pincode: ""
    });

    setProfilePhoto("");
    setProfilePhotoFile(null);

    if (profilePhotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    setProfilePhotoPreview("");

    setDesignation("");
    setEmploymentType("Full-time");
    setJoiningDate("");
    setEmploymentStatus("Active");
    setReportingManager("");

    setBondApplicable(false);
    setBondStartDate("");
    setBondEndDate("");
    setBondAmount("");

    setEditingId("");
    setFieldErrors({});
  }

  // Fill the form when Edit is clicked
  function editEmployee(employee) {
    setEditingId(employee._id || employee.id);

    // Basic information
    setName(employee.name || "");
    setEmail(employee.email || "");
    setDepartment(employee.department || "");
    setSalary(employee.salary ?? "");

    // Personal details
    setPhone(employee.phone || "");
    setDateOfBirth(employee.dateOfBirth?.slice(0, 10) || "");
    setGender(employee.gender || "");

    setPermanentAddress({
      street: employee.permanentAddress?.street || "",
      city: employee.permanentAddress?.city || "",
      state: employee.permanentAddress?.state || "",
      pincode: employee.permanentAddress?.pincode || ""
    });

    // Existing profile photo
    setProfilePhoto(employee.profilePhoto || "");
    setProfilePhotoFile(null);
    setProfilePhotoPreview(
      employee.profilePhoto
        ? `http://localhost:5000${employee.profilePhoto}`
        : ""
    );

    // Employment details
    setDesignation(employee.designation || "");
    setEmploymentType(employee.employmentType || "Full-time");
    setJoiningDate(employee.joiningDate?.slice(0, 10) || "");
    setEmploymentStatus(employee.employmentStatus || "Active");
    setReportingManager(employee.reportingManager || "");

    // Bond details
    const bond = employee.bondDetails || {};

    setBondApplicable(bond.applicable || false);
    setBondStartDate(bond.startDate?.slice(0, 10) || "");
    setBondEndDate(bond.endDate?.slice(0, 10) || "");
    setBondAmount(bond.bondAmount ?? "");

    setError("");
    setSuccess("");
    setFieldErrors({});
    setActiveTab("register");
  }

  // Clear the form when Cancel is clicked
  function cancelEdit() {
    resetEmployeeForm();
    setError("");
    setSuccess("");
    setActiveTab("directory");
  }

  // Delete an employee
  async function deleteEmployee(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");

    try {
      await removeEmployee(id);
      setSuccess("Employee deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  // Filter employees for the directory
  const filteredEmployees = employees.filter((emp) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    const id = (emp._id || emp.id || "").toLowerCase();
    const empName = (emp.name || "").toLowerCase();
    const empEmail = (emp.email || "").toLowerCase();
    const dept = (emp.department || "").toLowerCase();
    const salaryStr =
      emp.salary !== undefined && emp.salary !== null
        ? String(emp.salary)
        : "";
    return (
      empName.includes(query) ||
      empEmail.includes(query) ||
      dept.includes(query) ||
      id.includes(query) ||
      salaryStr.includes(query)
    );
  });

  return (
    <div className="vintage-container">
      <Header />
      {/* Tabs */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setError("");
          setSuccess("");
          setFieldErrors({});

        }}
        editingId={editingId}
        employees={employees}
        isAdmin={isAdmin}
      />
      {/* Alerts */}
      <AlertMessage
        error={error}
        success={success}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* TAB 1: ADD / EDIT EMPLOYEE FORM */}
      {activeTab === "register" && isAdmin && (
        <EmployeeForm
          // Basic information
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          department={department}
          setDepartment={setDepartment}
          salary={salary}
          setSalary={setSalary}

          // Personal details
          phone={phone}
          setPhone={setPhone}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          gender={gender}
          setGender={setGender}
          permanentAddress={permanentAddress}
          setPermanentAddress={setPermanentAddress}

          // Profile photo
          profilePhotoPreview={profilePhotoPreview}
          setProfilePhotoFile={handleProfilePhotoSelection}

          // Employment details
          designation={designation}
          setDesignation={setDesignation}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          joiningDate={joiningDate}
          setJoiningDate={setJoiningDate}
          employmentStatus={employmentStatus}
          setEmploymentStatus={setEmploymentStatus}
          reportingManager={reportingManager}
          setReportingManager={setReportingManager}

          // Bond details
          bondApplicable={bondApplicable}
          setBondApplicable={setBondApplicable}
          bondStartDate={bondStartDate}
          setBondStartDate={setBondStartDate}
          bondEndDate={bondEndDate}
          setBondEndDate={setBondEndDate}
          bondAmount={bondAmount}
          setBondAmount={setBondAmount}

          // Form actions
          editingId={editingId}
          loading={loading}
          handleSubmit={handleSubmit}
          cancelEdit={cancelEdit}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
        />
      )}

      {/* TAB 2: VIEW EMPLOYEES DIRECTORY */}
      {activeTab === "directory" && (
        <EmployeeDirectory
          employees={employees}
          filteredEmployees={filteredEmployees}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          setActiveTab={setActiveTab}
          editEmployee={editEmployee}
          deleteEmployee={deleteEmployee}
          isAdmin={isAdmin}
          onSelect={openDetails}
        />
      )}

      {/* POPUP: EMPLOYEE FULL DETAILS MODAL */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}

export default EmployeeDashboard;
