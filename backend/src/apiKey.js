import crypto from "crypto";
import { APIKey } from "./db.js";

export function generateAPIKey() {
  return `wa_live_${crypto.randomBytes(32).toString("hex")}`;
}

export function hashAPIKey(key) {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
}

export async function createAPIKey(developerId) {
  const key = generateAPIKey();

  const keyDocument = await APIKey.create({
    developerId,
    keyHash: hashAPIKey(key),
  });

  return {
    key,
    id: keyDocument._id,
  };
}