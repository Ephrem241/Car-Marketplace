import mongoose from "mongoose";

const SearchManufacturerSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  setManufacturer: {
    type: String,
    required: true,
  },
});

const SearchManufacturer = mongoose.model(
  "SearchManufacturer",
  SearchManufacturerSchema
);
export default SearchManufacturer;
