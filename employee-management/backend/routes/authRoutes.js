
const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    logout,
    getMe
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Get currently logged-in user
router.get("/me", authMiddleware, getMe);

module.exports = router;
