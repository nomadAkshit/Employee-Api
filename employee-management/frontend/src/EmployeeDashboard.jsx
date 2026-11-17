import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import Navigation from "./components/Navigation.jsx";
import AlertMessage from "./components/AlertMessage.jsx";
import EmployeeForm from "./components/EmployeeForm.jsx";
import EmployeeDirectory from "./components/EmployeeDirectory.jsx";
import { apiFetch } from "./utils/api";
import { useAuth } from "./context/AuthContext";

const API_URL = "http://localhost:5000/api/employees";

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
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

  async function getEmployees() {
    try {
      const response = await apiFetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not get employees");
      }

      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    getEmployees();
  }, []);

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

    // Required fields validation with exact field labels
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
      const firstError = Object.values(newErrors)[0];
      setError(firstError);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const employee = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      salary: Number(salary),
    };

    try {

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await apiFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(employee),
      });


      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 409 ||
          data.message?.toLowerCase().includes("email already exists")
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "User email already exists",
          }));
        } else if (data.message?.includes("is required")) {
          if (data.message.includes("Full Name"))
            setFieldErrors((prev) => ({ ...prev, name: data.message }));
          if (data.message.includes("Email Address"))
            setFieldErrors((prev) => ({ ...prev, email: data.message }));
          if (data.message.includes("Department"))
            setFieldErrors((prev) => ({ ...prev, department: data.message }));
          if (data.message.includes("Salary"))
            setFieldErrors((prev) => ({ ...prev, salary: data.message }));
        }
        throw new Error(data.message || "Something went wrong");
      }

      setName("");
      setEmail("");
      setDepartment("");
      setSalary("");
      setFieldErrors({});
      const wasEditing = !!editingId;
      setEditingId("");

      setSuccess(
        wasEditing
          ? "Employee updated successfully."
          : "Employee registered successfully."
      );

      if (wasEditing) {
        setActiveTab("directory");
      }

      // Refresh employee list
      getEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Fill the form when Edit is clicked
  function editEmployee(employee) {
    setEditingId(employee._id || employee.id);
    setName(employee.name || "");
    setEmail(employee.email || "");
    setDepartment(employee.department || "");
    setSalary(
      employee.salary !== undefined && employee.salary !== null
        ? employee.salary
        : ""
    );
    setError("");
    setSuccess("");
    setFieldErrors({});
    setActiveTab("register");
  }

  // Clear the form when Cancel is clicked
  function cancelEdit() {
    setEditingId("");
    setName("");
    setEmail("");
    setDepartment("");
    setSalary("");
    setError("");
    setSuccess("");
    setFieldErrors({});
    setActiveTab("directory");
  }

  // Delete an employee
  async function deleteEmployee(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await apiFetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete employee");
      }

      setSuccess("Employee deleted successfully.");
      getEmployees();
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
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          department={department}
          setDepartment={setDepartment}
          salary={salary}
          setSalary={setSalary}
          editingId={editingId}
          loading={loading}
          handleSubmit={handleSubmit}
          cancelEdit={cancelEdit}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
          checkEmailDuplicate={checkEmailDuplicate}
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
        />
      )}
    </div>
  );
}

export default EmployeeDashboard;
