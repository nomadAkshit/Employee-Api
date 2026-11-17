import EmployeeTable from "./EmployeeTable.jsx";

function EmployeeDirectory({
    employees,
    filteredEmployees,
    searchFilter,
    setSearchFilter,
    setActiveTab,
    editEmployee,
    deleteEmployee,
    isAdmin
}) {
    return (
        <section className="vintage-card">
            <div className="directory-header">
                <h2>Employee List ({employees.length})</h2>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />

                    {searchFilter && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={() => setSearchFilter("")}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {employees.length === 0 ? (
                <div className="empty-state">
                    <p>No employees registered yet.</p>

                    {isAdmin && (
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setActiveTab("register")}
                        >
                            Add First Employee
                        </button>
                    )}
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="empty-state">
                    <p>No employees found matching "{searchFilter}".</p>

                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSearchFilter("")}
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <EmployeeTable
                    employees={filteredEmployees}
                    editEmployee={editEmployee}
                    deleteEmployee={deleteEmployee}
                    isAdmin={isAdmin}
                />
            )}
        </section>
    );
}

export default EmployeeDirectory;
