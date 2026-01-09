import crypto from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = env.CHAVE_CRIPTOGRAFIA;
const IV_LENGTH = 16;




export function criptografa(text: string): string {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, "hex"), iv);

        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        const authTag = cipher.getAuthTag();
        
        return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
    } catch (error) {
        throw error;
    }
}

export function desencriptografa(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(SECRET_KEY, "hex"),
        iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}