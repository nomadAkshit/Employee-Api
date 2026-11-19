
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const Employee = require("../models/Employee");

// Generate employee ID
function generateEmployeeId() {
    return `EMP-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

// Delete uploaded photo
function deletePhoto(photoPath) {
    if (!photoPath) return;

    const filename = path.basename(photoPath);
    const fullPath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

// Get uploaded photo path
function getPhotoPath(file) {
    return file ? `/uploads/${file.filename}` : "";
}

// Validate employee data
function validateEmployee(data) {
    const { name, email, department, salary } = data;

    if (!name?.trim()) return "Full Name is required";
    if (!email?.trim()) return "Email Address is required";
    if (!department?.trim()) return "Department is required";

    if (
        salary === undefined ||
        salary === null ||
        salary === "" ||
        !Number.isFinite(Number(salary))
    ) {
        return "Salary is required and must be a valid number";
    }

    return null;
}

// Prepare employee data

// Convert FormData JSON strings into objects
function parseObjectField(value, fieldName) {
    if (!value) return {};

    if (typeof value === "string") {
        try {
            value = JSON.parse(value);
        } catch {
            throw new Error(`${fieldName} must contain valid JSON`);
        }
    }

    if (
        typeof value !== "object" ||
        Array.isArray(value) ||
        value === null
    ) {
        throw new Error(`${fieldName} must be an object`);
    }

    return value;
}

// Prepare employee data
function prepareEmployeeData(data, existingPhoto = "") {
    const address = parseObjectField(
        data.permanentAddress,
        "Permanent address"
    );

    const bond = parseObjectField(
        data.bondDetails,
        "Bond details"
    );

    const bondApplicable =
        bond.applicable === true || bond.applicable === "true";

    return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone || "",
        profilePhoto: existingPhoto,

        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || "",

        permanentAddress: {
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || ""
        },

        department: data.department.trim(),
        designation: data.designation || "",
        employmentType: data.employmentType || "Full-time",
        joiningDate: data.joiningDate || null,
        employmentStatus: data.employmentStatus || "Active",
        reportingManager: data.reportingManager || "",

        bondDetails: bondApplicable
            ? {
                applicable: true,
                startDate: bond.startDate || null,
                endDate: bond.endDate || null,
                durationMonths: bond.durationMonths || null,
                bondAmount:
                    bond.bondAmount === "" || bond.bondAmount == null
                        ? null
                        : Number(bond.bondAmount),
                agreementDocument: "",
                status: "Active"
            }
            : {
                applicable: false,
                startDate: null,
                endDate: null,
                durationMonths: null,
                bondAmount: null,
                agreementDocument: "",
                status: "Not Applicable"
            },

        salary: Number(data.salary)
    };
}


// GET: All employees

// GET: All employees with pagination
exports.getEmployees = async (req, res) => {
    try {
        // Get pagination values from URL
        let page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;

        // Prevent invalid pagination values
        page = Math.max(1, page);
        limit = Math.min(Math.max(1, limit), 100);

        // Calculate records to skip
        const skip = (page - 1) * limit;

        // Fetch employees and total count
        const [employees, totalEmployees] = await Promise.all([
            Employee.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Employee.countDocuments()
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(totalEmployees / limit);

        // Send response
        res.status(200).json({
            employees,
            pagination: {
                currentPage: page,
                totalPages,
                totalEmployees,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get employees error:", error);

        res.status(500).json({
            message: "Failed to fetch employees"
        });
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
        const validationError = validateEmployee(req.body);

        if (validationError) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(400).json({ message: validationError });
        }

        const normalizedEmail = req.body.email.trim().toLowerCase();

        const existingEmployee = await Employee.findOne({
            email: normalizedEmail
        });

        if (existingEmployee) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(409).json({
                message: "Employee email already exists"
            });
        }

        const employeeData = prepareEmployeeData(
            req.body,
            getPhotoPath(req.file)
        );

        const newEmployee = await Employee.create({
            ...employeeData,
            employeeId: generateEmployeeId()
        });

        res.status(201).json({
            message: "Employee created successfully",
            employee: newEmployee
        });

    } catch (error) {
        if (req.file) deletePhoto(getPhotoPath(req.file));

        console.log(error);
        if (
            error.message === "Permanent address must contain valid JSON" ||
            error.message === "Bond details must contain valid JSON" ||
            error.message === "Permanent address must be an object" ||
            error.message === "Bond details must be an object"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Employee already exists"
            });
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

        if (!mongoose.isValidObjectId(id)) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const validationError = validateEmployee(req.body);

        if (validationError) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(400).json({ message: validationError });
        }

        const currentEmployee = await Employee.findById(id);

        if (!currentEmployee) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const normalizedEmail = req.body.email.trim().toLowerCase();

        const existingEmployee = await Employee.findOne({
            email: normalizedEmail,
            _id: { $ne: id }
        });

        if (existingEmployee) {
            if (req.file) deletePhoto(getPhotoPath(req.file));

            return res.status(409).json({
                message: "Employee email already exists"
            });
        }

        const oldPhoto = currentEmployee.profilePhoto || "";

        const newPhoto = req.file
            ? getPhotoPath(req.file)
            : oldPhoto;

        const employeeData = prepareEmployeeData(
            req.body,
            newPhoto
        );

        const employee = await Employee.findByIdAndUpdate(
            id,
            { $set: employeeData },
            {
                new: true,
                runValidators: true
            }
        );

        // Delete old photo only after successful database update
        if (req.file && oldPhoto) {
            deletePhoto(oldPhoto);
        }

        res.json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {
        if (req.file) deletePhoto(getPhotoPath(req.file));

        console.log(error);
        if (
            error.message === "Permanent address must contain valid JSON" ||
            error.message === "Bond details must contain valid JSON" ||
            error.message === "Permanent address must be an object" ||
            error.message === "Bond details must be an object"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Employee email already exists"
            });
        }

        if (error.name === "ValidationError") {
            const firstErr = Object.values(error.errors)[0]?.message;
            return res.status(400).json({ message: firstErr });
        }

        res.status(500).json({
            message: "Failed to update employee"
        });
    }
};

// DELETE: Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.profilePhoto) {
            deletePhoto(employee.profilePhoto);
        }

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete employee"
        });
    }
};
