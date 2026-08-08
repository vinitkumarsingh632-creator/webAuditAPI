import crypto from "crypto";
import { Developer } from "./db.js";

export function generateDeveloperSecret() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashSecret(secret) {
  return crypto
    .createHash("sha256")
    .update(secret)
    .digest("hex");
}

export async function developerAuth(req, res, next) {
  try {
    const developerId = req.headers["x-developer-id"];
    const secret = req.headers["x-developer-secret"];

    if (!developerId || !secret) {
      return res.status(401).json({
        status: false,
        message: "Developer credentials are required.",
      });
    }

    const developer = await Developer.findById(developerId);

    if (!developer) {
      return res.status(401).json({
        status: false,
        message: "Invalid developer credentials.",
      });
    }

    const secretHash = hashSecret(secret);

    if (secretHash !== developer.secretHash) {
      return res.status(401).json({
        status: false,
        message: "Invalid developer credentials.",
      });
    }

    req.developer = developer;

    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      status: false,
      message: "Developer authentication failed.",
    });
  }
}