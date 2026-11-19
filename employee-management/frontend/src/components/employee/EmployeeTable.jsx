import EmployeeRow from "./EmployeeRow.jsx";
function EmployeeTable({ employees, editEmployee, deleteEmployee, isAdmin, onSelect }) {
    return (
        <div className="table-wrapper">
            <table className="vintage-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((employee) => (
                        <EmployeeRow
                            key={employee._id || employee.id}
                            employee={employee}
                            editEmployee={editEmployee}
                            deleteEmployee={deleteEmployee}
                            isAdmin={isAdmin}
                            onSelect={onSelect}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}




export default EmployeeTable;