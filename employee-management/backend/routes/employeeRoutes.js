
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

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
// "profilePhoto" is the name of the uploaded file field
router.post(
    "/",
    adminMiddleware,
    upload.single("profilePhoto"),
    createEmployee
);

router.put(
    "/:id",
    adminMiddleware,
    upload.single("profilePhoto"),
    updateEmployee
);

router.delete("/:id", adminMiddleware, deleteEmployee);

module.exports = router;
