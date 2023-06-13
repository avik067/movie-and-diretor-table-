const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");

let db = null;

const dbPath = path.join(__dirname, "moviesData.db");

//////////////////////////////////////////////////////////
const listenAndinitializeDb = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server is running at  : http://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB Error :${err.message}`);
    process.exit(1);
  }
};
listenAndinitializeDb();
/////////////////////////////////////////////////////////

// GET 1 API 1

app.get("/movies/", async (request, response) => {
  const getPlayersSqlcode = `
    SELECT movie_name
    FROM  movie
    ORDER BY movie_id;
   `;
  const finalOutputArray = await db.all(getPlayersSqlcode);
  let arr = [];
  for (let i of finalOutputArray) {
    arr.push(convertDbObjectToResponseObject(i));
  }
  response.send(arr);
});

// ADD POST

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const addPlayer = `
    INSERT INTO
        movie (director_id,movie_name,lead_actor)
    VALUES (
       '${directorId}',
       '${movieName}',
       '${leadActor}'
    );
   `;
  const responseDb = await db.run(addPlayer);
  const movieId = responseDb.lastID;
  //response.send({ movieId: movieId });
  response.send("Movie Successfully Added");
});

// GET  data of movie on movieId

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const fetchQuery = ` SELECT * FROM movie WHERE movie_id  = ${movieId} ;`;
  const finalOutputArray = await db.all(fetchQuery);

  response.send(finalOutputArray);
});

// PUT new data

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const addMovie = `
    UPDATE
        movie
    SET
      director_id =  '${directorId}',
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE
      movie_id = '${movieId}'
    ;
   `;
  const responseDb = await db.run(addMovie);

  response.send("Movie Details Updated");
});

//DELETE player on playerid

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const deletePlayer = `
    DELETE FROM
        movie
    WHERE
      movie_id = '${movieId}'
    ;
   `;
  const responseDb = await db.run(deletePlayer);
  response.send("Movie Removed");
});

// GET  data of diretor on directorID

app.get("/directors/", async (request, response) => {
  const getDirector = `
    SELECT *
    FROM  director
    ORDER BY director_id;
   `;
  const finalOutputArray = await db.all(getDirector);
  let arr = [];
  for (let i of finalOutputArray) {
    arr.push(convertDbObjectToResponseObject_2(i));
  }
  response.send(arr);
});

// GET movies on Direcors name

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getPlayersSqlcode = `
    SELECT movie_name
    FROM  movie
    WHERE director_id = ${directorId}
    ORDER BY movie_id;
   `;
  const finalOutputArray = await db.all(getPlayersSqlcode);
  let arr = [];
  for (let i of finalOutputArray) {
    arr.push(convertDbObjectToResponseObject(i));
  }
  response.send(arr);
});

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

const convertDbObjectToResponseObject_1 = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDbObjectToResponseObject_2 = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};
module.exports = listenAndinitializeDb;
module.exports = app;
