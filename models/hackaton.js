const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const hackatonSchema = new Schema({
  title: { type: String, required: true, unique: true },
  organisateur: { type: String, required: true },
  theme: { type: String, required: true },
  email: { type: String, required: true },
  // logo: { type: *****, required: true },
  description: { type: String, required: true },
  StartingDate: { type: Date, required: true },
  EndingDate: { type: Date, required: true },
  participants: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Team" },
  ],
  // document : { type: *****, required: true },
});

teamSchema.plugin(uniqueValidator);
module.exports = mongoose.model("hackaton", hackatonSchema);
