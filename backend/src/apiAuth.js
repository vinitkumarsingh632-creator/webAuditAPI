import { APIKey } from "./db.js";
import { hashAPIKey } from "./apiKey.js";

export async function APIAuth(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        status: false,
        message: "API key is required.",
      });
    }

    const keyHash = hashAPIKey(apiKey);

    const keyDocument = await APIKey.findOne({
      keyHash,
      active: true,
    });

    if (!keyDocument) {
      return res.status(401).json({
        status: false,
        message: "Invalid API key.",
      });
    }

    await APIKey.updateOne(
      { _id: keyDocument._id },
      {
        $set: {
          lastUsedAt: new Date(),
        },
        $inc: {
          requestCount: 1,
        },
      }
    );

    req.apiKey = keyDocument;

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "API key validation failed.",
    });
  }
}