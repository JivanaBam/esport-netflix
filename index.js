import express from "express";
import connectDb from "./connect.db.js";
import Movie from "./movie.module.js";
import mongoose from "mongoose";

const app = express();

//==========to make app understand json==========
app.use(express.json());

//==========database connection==================
connectDb();

//=================routes===================
//? add movies

app.post("/movie/add", async (req, res) => {
  const newMovie = req.body;

  await Movie.create(newMovie);

  return res.status(200).send({ message: `Movie is added successfully.` });
});

//? get movie list
app.get("/movie/list", async (req, res) => {
  const movieList = await Movie.find();
  return res.status(200).send({ message: "success", movies: movieList });
});

// get movie details by _id
app.get("/movie/details/:id", async (req, res) => {
  // extract movie id from req.params
  const movieId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(movieId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo Id." });
  }

  // find movie by id
  const requiredmovie = await Movie.findOne({ _id: movieId });

  // if not movie,throw error
  if (!requiredmovie) {
    return res.status(404).send({ message: "Movie does not exist." });
  }
  // send response
  return res
    .status(200)
    .send({ message: "success", movieDetails: requiredmovie });
});

//? delete movie

app.delete("/movie/delete/:id", async (req, res) => {
  // extract movie id from req.params
  const movieId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(movieId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo Id." });
  }

  // find movie by id
  const requiredmovie = await Movie.findOne({ _id: movieId });

  // if not movie, throw error
  if (!requiredmovie) {
    return res.status(404).send({ message: "Movie does not exist." });
  }

  // delete movie
  await Movie.deleteOne({ _id: movieId });

  // send response
  return res.status(200).send({ messge: "movie is deleted successfully." });
});

// ?edit movie

app.put("/movie/update/:id", async (req, res) => {
  // extract movieId from req.params
  const movieId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(movieId);

  // if not valid, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo Id." });
  }
  // find movie by id
  const requiredMovie = await Movie.findOne({ _id: movieId });

  // if not movie, throw error
  if (!requiredMovie) {
    return res.status(404).send({ message: "Movie does not exist." });
  }

  // get new values from req.body
  const newValues = req.body;

  // edit movie
  await Movie.updateOne(
    { _id: movieId },
    {
      $set: {
        name: newValues.name,
        actorName: newValues.actorName,
        length: newValues.length,
        rating: newValues.rating,
      },
    }
  );
  // send response
  return res.status(200).send({ message: "Movie is updated sucsessfully." });
});

//============PORT and server====================

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
