
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        // BASIC DETAILS
        employeeId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        name: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email Address is required"],
            trim: true,
            unique: true,
            lowercase: true
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        profilePhoto: {
            type: String,
            default: ""
        },

        // PERSONAL DETAILS
        dateOfBirth: {
            type: Date,
            default: null
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other", ""],
            default: ""
        },

        permanentAddress: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" }
        },

        // EMPLOYMENT DETAILS
        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true
        },

        designation: {
            type: String,
            trim: true,
            default: ""
        },

        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Intern"],
            default: "Full-time"
        },

        joiningDate: {
            type: Date,
            default: null
        },

        employmentStatus: {
            type: String,
            enum: ["Active", "Inactive", "On Leave"],
            default: "Active"
        },

        reportingManager: {
            type: String,
            trim: true,
            default: ""
        },

        // EMPLOYMENT BOND DETAILS
        bondDetails: {
            applicable: {
                type: Boolean,
                default: false
            },

            startDate: {
                type: Date,
                default: null
            },

            endDate: {
                type: Date,
                default: null
            },

            durationMonths: {
                type: Number,
                default: null
            },

            bondAmount: {
                type: Number,
                default: null
            },

            agreementDocument: {
                type: String,
                default: ""
            },

            status: {
                type: String,
                enum: ["Not Applicable", "Active", "Completed"],
                default: "Not Applicable"
            }
        },

        // SALARY DETAILS
        salary: {
            type: Number,
            required: [true, "Salary is required"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);
