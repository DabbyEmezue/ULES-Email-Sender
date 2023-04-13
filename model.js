const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ulesSchema = new Schema({
  PIN: { type: String },
  isUsed: { type: Boolean, default: false },
});

const ulesModel = mongoose.model("ules", ulesSchema);

module.exports = ulesModel;
