
function Navigation({ activeTab, setActiveTab, editingId, employees, isAdmin }) {
    return (
        <nav className="vintage-nav">

            {isAdmin && (
                <button
                    type="button"
                    className={`nav-tab ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => setActiveTab("register")}
                >
                    {editingId ? "Edit Employee" : "Add Employee"}
                </button>
            )}


            <button
                type="button"
                className={`nav-tab ${activeTab === "directory" ? "active" : ""}`}
                onClick={() => setActiveTab("directory")}
            >
                View Employees ({employees.length})
            </button>
        </nav>
    );
}

export default Navigation;
