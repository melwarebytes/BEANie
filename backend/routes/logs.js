const express = require("express");
const router = express.Router();

const {
  createLog,
  getLogs,
  deleteLog
} = require("../controllers/cuppingLogController");

router.get("/", getLogs);
router.post("/", createLog);
router.delete("/:id", deleteLog);

module.exports = router;
