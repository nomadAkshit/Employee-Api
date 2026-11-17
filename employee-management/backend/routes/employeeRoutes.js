
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

// All employee routes require login
router.use(authMiddleware);

// Both admin and normal users can view employees
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

// Only admins can add, edit and delete employees
router.post("/", adminMiddleware, createEmployee);
router.put("/:id", adminMiddleware, updateEmployee);
router.delete("/:id", adminMiddleware, deleteEmployee);

module.exports = router;
