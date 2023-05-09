import mongoose from "mongoose";

const addDetSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  desc: {
    type: Array,
    required: true,
  },
});

const addDet = mongoose.model("car-detail", addDetSchema);

export default addDet