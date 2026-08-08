import { user } from "./db.js";

export async function APIAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({
        status: false,
        message: "API key required.",
      });
    }

    const [type, key] = auth.split(" ");

    if (type !== "Bearer" || !key) {
      return res.status(401).json({
        status: false,
        message: "Use Authorization: Bearer <API_KEY>",
      });
    }

    const userData = await user.findOne({
      APIKey: key,
    });

    if (!userData) {
      return res.status(401).json({
        status: false,
        message: "Invalid API key.",
      });
    }

    req.apiUser = userData;

    next();

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Authentication error.",
    });
  }
}