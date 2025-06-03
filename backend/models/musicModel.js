import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    musicFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imageFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
const musicModel =
  mongoose.models.music || mongoose.model("music", musicSchema);
export default musicModel;
