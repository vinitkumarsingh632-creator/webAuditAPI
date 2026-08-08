import crypto from "crypto";
import { APIKey } from "./db.js";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  return crypto
    .createHash("sha256")
    .update(process.env.API_KEY_ENCRYPTION_SECRET)
    .digest();
}

export function generateAPIKey() {
  return `wa_live_${crypto
    .randomBytes(32)
    .toString("hex")}`;
}

export function hashAPIKey(key) {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
}

export function encryptAPIKey(key) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv
  );

  let encrypted = cipher.update(
    key,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decryptAPIKey(data) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(data.iv, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(data.authTag, "hex")
  );

  let decrypted = decipher.update(
    data.encrypted,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}

export async function createAPIKey(developerId) {
  const key = generateAPIKey();

  const encryptedData = encryptAPIKey(key);

  const keyDocument = await APIKey.findOneAndUpdate(
  { developerId },
  {
    $set: {
      keyHash: hashAPIKey(key),
      encryptedKey: encryptedData.encrypted,
      encryptionIv: encryptedData.iv,
      encryptionAuthTag: encryptedData.authTag,
      active: true,
      lastUsedAt: null,
      requestCount: 0,
    },
    $setOnInsert: {
      developerId,
      createdAt: new Date(),
    },
  },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }
);

console.log("UPDATED API KEY DOCUMENT:", {
  id: keyDocument._id,
  developerId: keyDocument.developerId,
  hasEncryptedKey: !!keyDocument.encryptedKey,
  hasIv: !!keyDocument.encryptionIv,
  hasAuthTag: !!keyDocument.encryptionAuthTag,
});

  return {
    key,
    id: keyDocument._id,
  };
}