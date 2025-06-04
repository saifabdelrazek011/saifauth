import nodemailer from "nodemailer";
import { EMAIL_SERVICE, EMAIL_ADDRESS, EMAIL_PASSWORD } from "../config/env.js";



const transport = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },
});

export default transport