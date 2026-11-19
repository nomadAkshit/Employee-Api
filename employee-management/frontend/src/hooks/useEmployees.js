
import { useCallback, useState } from "react";
import { apiFetch } from "../utils/api";

const API_URL = "http://localhost:5000/api/employees";

const DEFAULT_LIMIT = 10;

// Safely read API responses
async function readResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    const text = await response.text();

    if (!response.ok) {
        throw new Error(
            `Server returned ${response.status}: ${text.slice(0, 200)}`
        );
    }

    throw new Error("Server returned an unexpected response.");
}

function useEmployees() {
    const [employees, setEmployees] = useState([]);

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalEmployees: 0,
        limit: DEFAULT_LIMIT,
        hasNextPage: false,
        hasPrevPage: false,
    });

    // GET employees with backend pagination
    const getEmployees = useCallback(async (
        page = pagination.currentPage,
        limit = pagination.limit
    ) => {
        const response = await apiFetch(
            `${API_URL}?page=${page}&limit=${limit}`
        );

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(data.message || "Could not get employees");
        }

        setEmployees(data.employees);
        setPagination(data.pagination);

        return data;
    }, [pagination.currentPage, pagination.limit]);

    // POST new employee or PUT existing employee
    const saveEmployee = useCallback(async (editingId, formData) => {
        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const response = await apiFetch(url, {
            method: editingId ? "PUT" : "POST",
            body: formData,
        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(data.message || "Could not save employee");
        }

        // New employees appear at the beginning of the list
        await getEmployees(editingId ? pagination.currentPage : 1);

        return data;
    }, [getEmployees, pagination.currentPage]);

    // DELETE employee
    const removeEmployee = useCallback(async (id) => {
        const response = await apiFetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(data.message || "Could not delete employee");
        }

        const result = await getEmployees();

        // If the last employee on a page was deleted,
        // move back to the previous page.
        if (
            result.employees.length === 0 &&
            result.pagination.currentPage > 1
        ) {
            await getEmployees(result.pagination.currentPage - 1);
        }

        return data;
    }, [getEmployees]);

    return {
        employees,
        pagination,
        getEmployees,
        saveEmployee,
        removeEmployee,
    };
}

export default useEmployees;
