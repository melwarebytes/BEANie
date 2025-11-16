const mongoose = require("mongoose");

const CuppingLogSchema = new mongoose.Schema(
  {
    params: {
      brewMethod: String,
      roastLevel: String,
      grindSize: String,
      ratio: Number,
      tempC: Number,
    },

    predicted: [
      {
        flavor: String,
        score: Number
      }
    ],

    selection: [String],

    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CuppingLog", CuppingLogSchema);
