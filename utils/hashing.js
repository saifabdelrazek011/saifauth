import { hash } from "bcryptjs";

export const doHash = (value, saltValue) => {
    const result = hash(value, saltValue);
    return result;
}