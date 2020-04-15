const shortid = require("shortid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var issuesSchema = new Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    created_on: { type: Number, default: new Date() },
    updated_on: { type: Number, default: new Date() },
    open: { type: Boolean, default: true },
    _id: { type: String, default: shortid.generate },
  },
  { collection: "Issues" }
);

mongoose.model("Issues", issuesSchema);
