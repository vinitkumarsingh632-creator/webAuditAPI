import crypto from "crypto";

export function generateAPIKey() {
  const randomBytes = crypto.randomBytes(32).toString("hex");

  return `sk_live_${randomBytes}`;
}