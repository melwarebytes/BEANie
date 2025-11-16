const CuppingLog = require("../models/CuppingLogs");


exports.createLog = async (req, res) => {
  try {
    const log = await CuppingLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    console.error("Create Log Error:", err);
    res.status(500).json({ message: "Failed to save log" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await CuppingLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error("Get Logs Error:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    await CuppingLog.findByIdAndDelete(id);
    res.json({ message: "Log deleted" });
  } catch (err) {
    console.error("Delete Log Error:", err);
    res.status(500).json({ message: "Failed to delete log" });
  }
};
