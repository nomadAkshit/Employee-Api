
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

// GET: All employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch employees" });
    }
};

// GET: Single employee
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch employee" });
    }
};

// POST: Add employee
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, department, salary } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "Full Name is required" });
        }

        if (!email?.trim()) {
            return res.status(400).json({ message: "Email Address is required" });
        }

        if (!department?.trim()) {
            return res.status(400).json({ message: "Department is required" });
        }

        if (salary === undefined || salary === null || salary === "" || !Number.isFinite(Number(salary))) {
            return res.status(400).json({ message: "Salary is required and must be a valid number" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingEmployee = await Employee.findOne({
            email: normalizedEmail
        });

        if (existingEmployee) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newEmployee = await Employee.create({
            name: name.trim(),
            email: normalizedEmail,
            department: department.trim(),
            salary: Number(salary)
        });

        res.status(201).json(newEmployee);

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        if (error.name === "ValidationError") {
            const firstErr = Object.values(error.errors)[0]?.message;
            return res.status(400).json({ message: firstErr });
        }

        res.status(500).json({ message: "Failed to add employee" });
    }
};

// PUT: Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, department, salary } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        if (!name?.trim()) {
            return res.status(400).json({ message: "Full Name is required" });
        }

        if (!email?.trim()) {
            return res.status(400).json({ message: "Email Address is required" });
        }

        if (!department?.trim()) {
            return res.status(400).json({ message: "Department is required" });
        }

        if (salary === undefined || salary === null || salary === "" || !Number.isFinite(Number(salary))) {
            return res.status(400).json({ message: "Salary is required and must be a valid number" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingEmployee = await Employee.findOne({
            email: normalizedEmail,
            _id: { $ne: id }
        });

        if (existingEmployee) {
            return res.status(409).json({ message: "User already exists" });
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                email: normalizedEmail,
                department: department.trim(),
                salary: Number(salary)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({ message: "User email already exists" });
        }

        if (error.name === "ValidationError") {
            const firstErr = Object.values(error.errors)[0]?.message;
            return res.status(400).json({ message: firstErr });
        }

        res.status(500).json({ message: "Failed to update employee" });
    }
};

// DELETE: Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete employee" });
    }
};
