import mongoose from "mongoose";

const user = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: [true, "Email already exists"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
    forgetPasswordCode: {
        type: String,
        select: false
    },
    forgetPasswordCodeValiidation: {
        type: Number,
        select: false
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', user);

export default User;
