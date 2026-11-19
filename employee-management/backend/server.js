
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
// cookeies -parser
const cookieParser = require("cookie-parser");

app.use(cookieParser());

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
// Parse JSON bodies except multipart/form-data
app.use((req, res, next) => {
    const ct = req.headers['content-type'] || '';
    if (ct.includes('multipart/form-data')) {
        return next();
    }
    express.json({ type: ['application/json', 'application/*+json'] })(req, res, next);
});

// Static folder for uploaded profile photos
app.use(
    "/uploads",
    express.static(require("path").join(__dirname, "uploads"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);


// Global error handler
app.use((err, req, res, next) => {
    // Handle JSON parse errors (multipart/form-data sent to json parser)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON parse error:', err);
        return res.status(400).json({ message: 'Invalid request payload (expected JSON)' });
    }
    // Multer file filter errors
    if (err && err.message && err.message.startsWith('Only')) {
        console.error('File upload error:', err);
        return res.status(400).json({ message: err.message });
    }
    console.error('Unexpected error:', err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
});


// Test route
app.get("/", (req, res) => {
    res.send("Employee API is running!");
});

// Connect database and start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
