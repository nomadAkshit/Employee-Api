
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validateForm() {
        const errors = {};

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        // Name validation
        if (!trimmedName) {
            errors.name = "Name is required.";
        } else if (!/^[a-zA-Z\s]{1,50}$/.test(trimmedName)) {
            errors.name = "Name must contain only letters and spaces (maximum 50 characters).";
        }

        // Email validation
        if (!trimmedEmail) {
            errors.email = "Email is required.";
        } else if (trimmedEmail.length > 100) {
            errors.email = "Email cannot exceed 100 characters.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = "Please enter a valid email address.";
        }

        // Password validation
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must contain at least 8 characters.";
        } else if (password.length > 128) {
            errors.password = "Password cannot exceed 128 characters.";
        } else if (!/[A-Z]/.test(password)) {
            errors.password = "Include at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            errors.password = "Include at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            errors.password = "Include at least one number.";
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            errors.password = "Include at least one special character.";
        }

        // Confirm password
        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function clearFieldError(field) {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: ""
        }));

        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            await signup(name.trim(), email.trim(), password);

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h1>Create Account</h1>
                <p>Register to access the employee management system.</p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Name */}
                <label>Full Name</label>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    maxLength={50}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (/^[a-zA-Z\s]*$/.test(value)) {
                            setName(value);
                            clearFieldError("name");
                        }
                    }}
                    className={fieldErrors.name ? "input-error" : ""}
                />

                {fieldErrors.name && (
                    <span className="field-error-text">
                        ⚠ {fieldErrors.name}
                    </span>
                )}

                {/* Email */}
                <label>Email Address</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    maxLength={100}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                    }}
                    className={fieldErrors.email ? "input-error" : ""}
                />

                {fieldErrors.email && (
                    <span className="field-error-text">
                        ⚠ {fieldErrors.email}
                    </span>
                )}

                {/* Password */}
                <label>Password</label>

                <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    maxLength={128}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError("password");
                    }}
                    className={fieldErrors.password ? "input-error" : ""}
                />

                {fieldErrors.password && (
                    <span className="field-error-text">
                        ⚠ {fieldErrors.password}
                    </span>
                )}

                {/* Confirm Password */}
                <label>Confirm Password</label>

                <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    maxLength={128}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearFieldError("confirmPassword");
                    }}
                    className={fieldErrors.confirmPassword ? "input-error" : ""}
                />

                {fieldErrors.confirmPassword && (
                    <span className="field-error-text">
                        ⚠ {fieldErrors.confirmPassword}
                    </span>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
