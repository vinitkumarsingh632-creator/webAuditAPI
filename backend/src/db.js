import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DeveloperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    secretHash: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const APIKeySchema = new mongoose.Schema(
  {
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
      index: true,
    },

    keyHash: {
      type: String,
      required: true,
      unique: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    requestCount: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  }
);

const AuditHistorySchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ["ui", "api"],
      required: true,
      index: true,
    },

    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    URL: {
      type: String,
      required: true,
    },

    Timestamp: {
      type: Date,
      default: Date.now,
    },

    StatusCode: {
      type: Number,
      default: null,
    },

    Performance: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    SEO: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    Accessibility: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    Best_Practices: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    LCP: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    FCP: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    CLS: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    SpeedIndex: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    Latency: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    Result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  }
);

AuditHistorySchema.index({
  ownerType: 1,
  ownerId: 1,
  Timestamp: -1,
});

export const Developer =
  mongoose.models.Developer ||
  mongoose.model("Developer", DeveloperSchema);

export const APIKey =
  mongoose.models.APIKey ||
  mongoose.model("APIKey", APIKeySchema);

export const AuditHistory =
  mongoose.models.AuditHistory ||
  mongoose.model("AuditHistory", AuditHistorySchema);

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.DB_URI);

  console.log("MongoDB connected");
}