import jwt from "jsonwebtoken";
import geoip from 'geoip-lite';
import { signupSchema, signinSchema, acceptCodeSchema, changeForgetedPasswordSchema, changePasswordSchema, emailSchema } from "../middlewares/validator.js";
import User from "../models/usersModel.js";
import transport from '../middlewares/sendMail.js';
import { doHash, doHashValidation, hmacProcess } from "../utils/hashing.js";
import { JWT_SECRET, JWT_EXEXPIRES_IN, NODE_ENV, HMAC_SECRET, HASH_SALT, EMAIL_ADDRESS, SENDER_NAME } from "../config/env.js";
import { loginNotificationTemplate } from "../utils/email-template.js";


const getClientIP = (req) => {
    let ip = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;

    // Handle IPv6 format (::ffff:192.168.x.x)
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').pop();
    }

    // Handle localhost IPv6
    if (ip === '::1') return '127.0.0.1';

    return ip;
};

const getLocationFromIP = (ip) => {
    const geo = geoip.lookup(ip);
    if (geo) {
        return `${geo.city || 'Unknown City'}, ${geo.region || 'Unknown Region'}, ${geo.country || 'Unknown Country'}`;
    }
    return 'Unknown Location';
};


export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ firstName, lastName, email, password });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await doHash(password, HASH_SALT);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();

        result.password = undefined;

        return res.status(201).json({ success: true, message: "User created successfully", data: result });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinSchema.validate({ email, password });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid Email or password" });
        }


        const isPasswordValid = await doHashValidation(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }


        const ipAddress = await getClientIP(req);
        const location = await getLocationFromIP(ipAddress);
        const loginTime = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            showTimeZone: true,
            timeZoneName: 'short',

        });
        try {
            const emailHtml = loginNotificationTemplate(
                `${existingUser.firstName} ${existingUser.lastName ? existingUser.lastName : ''}`,
                ipAddress,
                location,
                loginTime
            );

            console.log('Email HTML:', emailHtml);
            // await transport.sendMail({
            //     from: `${SENDER_NAME}<${EMAIL_ADDRESS}>`,
            //     to: existingUser.email,
            //     subject: "New Login Alert - SaifAuth",
            //     html: emailHtml,
            // });
        } catch (emailError) {
            console.error('Failed to send login notification email:', emailError);
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        }, JWT_SECRET, { expiresIn: JWT_EXEXPIRES_IN });
        return res
            .cookie("Authorization", "Bearer " + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: NODE_ENV === "production",
                secure: NODE_ENV === "production"
            })
            .status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                data: { token }
            });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const signout = (req, res) => {
    try {
        res.clearCookie("Authorization").json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const sendVerification = async (req, res) => {
    const { email } = req.body;
    try {
        const { error, value } = emailSchema.validate(email);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const codeValue = Math.floor(1000000 * Math.random()).toString();

        let info = await transport.sendMail({
            from: `SaifAuth verifier<${EMAIL_ADDRESS}>`,
            to: existingUser.email,
            subject: "Verify your email",
            html: `<p>Your verification code is <b>${codeValue}</b></p>
            <p>This code will expire in 5 minutes</p>`,
        });

        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, HMAC_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: "Verification code sent successfully" });
        }

        res.status(400).json({ success: false, message: "Verification code not sent" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyUser = async (req, res) => {
    const { email, providedCode } = req.body;
    try {
        const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');

        console.log(existingUser);

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({ success: false, message: "Something is wrong with the verification code" });
        }

        if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }

        const hashedCodeValue = hmacProcess(codeValue, HMAC_SECRET);

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({ success: true, message: "User verified successfully" });
        }
        return res.status(400).json({ success: false, message: "Unexpected error occurred" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { userId, verified } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
        const { error, value } = changePasswordSchema.validate({ oldPassword, newPassword });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        if (!verified) {
            return res.status(401).json({ success: false, message: "User not verified" });
        }

        const existingUser = await User.findOne({ _id: userId }).select('+password');

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await doHashValidation(oldPassword, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        if (await doHashValidation(newPassword, existingUser.password)) {
            return res.status(400).json({ success: false, message: "New password cannot be the same as the old password" });
        }

        const hashedNewPassword = await doHash(newPassword, HASH_SALT);

        existingUser.password = hashedNewPassword;
        await existingUser.save();
        return res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}



export const sendForgotPasswordCode = async (req, res) => {
    const { email } = req.body;
    try {
        const { error, value } = emailSchema.validate(email);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        let info = await transport.sendMail({
            from: `${SENDER_NAME}<${EMAIL_ADDRESS}>`,
            to: existingUser.email,
            subject: "Forgot Password Verification Code",
            html: `<p>Your forget password verification code <b>${code}</b></p>
            <p>This code will expire in 10 minutes</p>`
        });

        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(code, HMAC_SECRET);
            existingUser.forgetPasswordCode = hashedCodeValue;
            existingUser.forgetPasswordCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: "Verification code sent successfully" });
        }

        return res.status(400).json({ success: false, message: "Verification code" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const changeForgetedPassword = async (req, res) => {
    const { email, providedCode, newPassword } = req.body;
    try {
        const { error, value } = changeForgetedPasswordSchema.validate({ email, providedCode, newPassword });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password +forgetPasswordCode +forgetPasswordCodeValidation');

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const hashedNewPassword = await doHash(newPassword, HASH_SALT);

        if (hashedNewPassword === existingUser.password) {
            return res.status(400).json({ success: false, message: "New password cannot be the same as the old password" });
        };

        if (!existingUser.forgetPasswordCode || !existingUser.forgetPasswordCodeValidation) {
            return res.status(400).json({ success: false, message: "Something is wrong with the verification code" });

        }

        const hashedCodeValue = await hmacProcess(providedCode, HMAC_SECRET);

        if (hashedCodeValue !== existingUser.forgetPasswordCode) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }


        if (Date.now() - existingUser.forgetPasswordCodeValidation > 10 * 60 * 1000) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }


        if (hashedCodeValue === existingUser.forgetPasswordCode) {
            existingUser.verified = true;
            existingUser.forgetPasswordCode = undefined;
            existingUser.forgetPasswordCodeValidation = undefined;
            existingUser.password = hashedNewPassword;

            await existingUser.save();
            return res.status(200).json({ success: true, message: "Password changed successfully" });
        }
        return res.status(400).json({ success: false, message: "Unexpected error occurred" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}