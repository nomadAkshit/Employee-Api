require("dotenv").config({
    path: require("path").join(__dirname, ".env")
});
console.log("SERVER FILE STARTED");
console.log("JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET));
console.log("JWT expiry:", process.env.JWT_EXPIRES_IN);
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Employee API is running!");
});

// Employee routes
app.use("/api/employees", employeeRoutes);

// Connect database and start server
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();

// // GET: Get all employees
// app.get("/api/employees", async (req, res) => {
//     try {
//         const employees = await Employee.find().sort({ createdAt: -1 });
//         res.json(employees);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Failed to fetch employees" });
//     }
// });

// // GET: Get a single employee by ID
// app.get("/api/employees/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({ message: "Invalid employee ID" });
//         }

//         const employee = await Employee.findById(id);

//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         res.json(employee);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Failed to fetch employee" });
//     }
// });

// // POST: Add a new employee
// app.post("/api/employees", async (req, res) => {
//     try {
//         const { name, email, department, salary } = req.body;

//         if (!name?.trim()) {
//             return res.status(400).json({ message: "Full Name is required" });
//         }
//         if (!email?.trim()) {
//             return res.status(400).json({ message: "Email Address is required" });
//         }
//         if (!department?.trim()) {
//             return res.status(400).json({ message: "Department is required" });
//         }
//         if (salary === undefined || salary === null || salary === "" || isNaN(Number(salary))) {
//             return res.status(400).json({ message: "Salary is required" });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         // Check for existing employee with this email
//         const existingEmployee = await Employee.findOne({ email: normalizedEmail });
//         if (existingEmployee) {
//             return res.status(409).json({ message: "User already exists" });
//         }

//         const newEmployee = await Employee.create({
//             name: name.trim(),
//             email: normalizedEmail,
//             department: department.trim(),
//             salary: Number(salary),
//         });

//         res.status(201).json(newEmployee);
//     } catch (error) {
//         console.log(error);
//         if (error.code === 11000) {
//             return res.status(409).json({ message: "User already exists" });
//         }
//         if (error.name === "ValidationError") {
//             const firstErr = Object.values(error.errors)[0]?.message || "Validation error";
//             return res.status(400).json({ message: firstErr });
//         }
//         res.status(500).json({ message: "Failed to add employee" });
//     }
// });

// // PUT: Update an employee
// app.put("/api/employees/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email, department, salary } = req.body;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({ message: "Invalid employee ID" });
//         }

//         if (!name?.trim()) {
//             return res.status(400).json({ message: "Full Name is required" });
//         }
//         if (!email?.trim()) {
//             return res.status(400).json({ message: "Email Address is required" });
//         }
//         if (!department?.trim()) {
//             return res.status(400).json({ message: "Department is required" });
//         }
//         if (salary === undefined || salary === null || salary === "" || isNaN(Number(salary))) {
//             return res.status(400).json({ message: "Salary is required" });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         // Check if another employee already has this email
//         const existingEmployee = await Employee.findOne({
//             email: normalizedEmail,
//             _id: { $ne: id },
//         });
//         if (existingEmployee) {
//             return res.status(409).json({ message: "User already exists" });
//         }

//         const employee = await Employee.findByIdAndUpdate(
//             id,
//             {
//                 name: name.trim(),
//                 email: normalizedEmail,
//                 department: department.trim(),
//                 salary: Number(salary),
//             },
//             {
//                 new: true,
//                 runValidators: true,
//             }
//         );

//         if (!employee) {
//             return res.status(404).json({
//                 message: "Employee not found",
//             });
//         }

//         res.json({
//             message: "Employee updated successfully",
//             employee,
//         });
//     } catch (error) {
//         console.log(error);
//         if (error.code === 11000) {
//             return res.status(409).json({ message: "User email already exists" });
//         }
//         if (error.name === "ValidationError") {
//             const firstErr = Object.values(error.errors)[0]?.message || "Validation error";
//             return res.status(400).json({ message: firstErr });
//         }
//         res.status(500).json({ message: "Failed to update employee" });
//     }
// });

// // DELETE: Delete an employee
// app.delete("/api/employees/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({ message: "Invalid employee ID" });
//         }

//         const employee = await Employee.findByIdAndDelete(id);

//         if (!employee) {
//             return res.status(404).json({
//                 message: "Employee not found",
//             });
//         }

//         res.json({
//             message: "Employee deleted successfully",
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Failed to delete employee" });
//     }
// });

// Connect MongoDB and start server
// mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(async () => {
//         console.log("MongoDB connected successfully!");

//         // Sync indexes (ensures unique index on email)
//         try {
//             await Employee.syncIndexes();
//             console.log("Database indexes synchronized.");
//         } catch (idxErr) {
//             console.error("Index sync error:", idxErr.message);
//         }

//         app.listen(PORT, () => {
//             console.log(`Server running at http://localhost:${PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.error("MongoDB connection failed:", error.message);
//         process.exit(1);
//     });
