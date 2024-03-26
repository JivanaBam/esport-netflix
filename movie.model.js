import mongoose from "mongoose";

// set rule/schema
const movieSchema = new mongoose.Schema({
  name: String,
  actorName: String,
  length: Number,
  rating: Number,
});

// create table/model
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
