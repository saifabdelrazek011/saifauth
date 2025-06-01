import { signupSchema } from "../middlewares/validator.js";
import User from "../models/usersModel.js";
import { doHash } from "../utils/hashing.js";

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

        const hashedPassword = await doHash(password, 12);

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
    res.json({ message: 'Signin Success' });
}

const authController = {
    signup,
    signin
}

export default authController