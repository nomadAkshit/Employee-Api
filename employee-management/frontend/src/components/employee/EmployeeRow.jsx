
function EmployeeRow({ employee, editEmployee, deleteEmployee, isAdmin, onSelect }) {
    const id = employee._id || employee.id;

    return (
        <tr className="employee-row" onClick={() => onSelect && onSelect(employee)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            <td className="col-id">{id.slice(0, 8)}</td>
            <td className="col-name">{employee.name}</td>
            <td className="col-email">{employee.email}</td>
            <td className="col-dept">
                <span className="badge-dept">
                    {employee.department}
                </span>
            </td>
            <td className="col-salary">
                {employee.salary !== undefined &&
                    employee.salary !== null &&
                    employee.salary !== ""
                    ? `₹${Number(employee.salary).toLocaleString("en-IN")}`
                    : "—"}
            </td>
            {isAdmin && (
                <td className="col-actions">
                    <button
                        type="button"
                        className="btn-edit"
                        onClick={(e) => { e.stopPropagation(); editEmployee(employee); }}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn-delete"
                        onClick={(e) => { e.stopPropagation(); deleteEmployee(id); }}
                    >
                        Delete
                    </button>
                </td>
            )}
        </tr>
    );
}

export default EmployeeRow;
