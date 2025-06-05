import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXEXPIRES_IN,
    SENDER_NAME,
    EMAIL_SERVICE,
    EMAIL_ADDRESS,
    EMAIL_PASSWORD,
    HMAC_SECRET,
    HASH_SALT,
    ARCJET_ENV,
    ARCJET_KEY,
    SURE_MESSAGE,
} = process.env;
