// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
const db = require("../models");
const Sequelize = require("sequelize");

// Routes
// =============================================================
module.exports = app => {
  // GET route for getting all of the games
  app.get("/", (req, res) => {
    res.render("index");
  });

  // Get route for retrieving games based on a partial search of a given keyword when we choose the genre and the platform
  app.get("/api/gamesgenreplatform/:name/:genre/:platform", (req, res) => {
    db.sequelize
      .query(
        "SELECT * from games join scores on games.name = scores.game and games.platform = scores.platform where ((game like ?) and (scores.genre like ?)) and ((game like ?) and (scores.platform = ?)) order by scores.score desc;",
        {
          replacements: [
            "%" + req.params.name + "%",
            "%" + req.params.genre + "%",
            "%" + req.params.name + "%",
            req.params.platform
          ],
          type: Sequelize.QueryTypes.SELECT
        }
      )
      .then(dbGame => {
        res.render("index", {
          games: dbGame
        });
      });
  });

  // Get route for retrieving games based on a partial search of a given keyword when we choose the genre
  app.get("/api/gamesgenre/:name/:genre", (req, res) => {
    db.sequelize
      .query(
        "SELECT * from games join scores on games.name = scores.game and games.platform = scores.platform where ((game like ?) and (scores.genre like ?)) order by scores.score desc",
        {
          replacements: [
            "%" + req.params.name + "%",
            "%" + req.params.genre + "%"
          ],
          type: Sequelize.QueryTypes.SELECT
        }
      )
      .then(dbGame => {
        res.render("index", {
          games: dbGame
        });
      });
  });

  // Get route for retrieving games based on a partial search of a given keyword when we choose the platform
  app.get("/api/gamesplatforms/:name/:platform", (req, res) => {
    db.sequelize
      .query(
        "SELECT * from games join scores on games.name = scores.game and games.platform = scores.platform where ((game like ?) and (scores.platform = ?)) order by scores.score desc;",
        {
          replacements: ["%" + req.params.name + "%", req.params.platform],
          type: Sequelize.QueryTypes.SELECT
        }
      )
      .then(dbGame => {
        res.render("index", {
          games: dbGame
        });
      });
  });

  // Get route for retrieving games based on a partial search of a given keyword
  app.get("/api/games/:name", (req, res) => {
    db.sequelize
      .query(
        "SELECT * from games join scores on games.name = scores.game and games.platform = scores.platform where game like ? order by scores.score desc;",
        {
          replacements: ["%" + req.params.name + "%"],
          type: Sequelize.QueryTypes.SELECT
        }
      )
      .then(dbGame => {
        res.render("index", {
          games: dbGame
        });
      });
  });

  // POST route for creating a new game
  app.post("/api/games", (req, res) => {
    console.log(req.body);
    db.Game.create({
      name: req.body.name,
      platform: req.body.platform,
      year: req.body.year,
      genre: req.body.genre,
      publisher: req.body.publisher,
      // eslint-disable-next-line camelcase
      Global_Sales: req.body.Global_Sales
    }).then(dbGame => {
      res.json(dbGame);
    });
  });
  // POST route for creating a new score
  app.post("/api/scores", (req, res) => {
    console.log(req.body);
    db.Score.create({
      game: req.body.game,
      platform: req.body.platform,
      score: req.body.score,
      genre: req.body.genre
    }).then(dbScore => {
      res.json(dbScore);
    });
  });

  // app.get("/api/games", (req, res) => {
  //   // findAll returns all entries for a table when used with no options
  //   db.Game.findAll({}).then(dbGame => {
  //     // We have access to the games as an argument inside of the callback function
  //     res.json(dbGame);
  //   });
  // });

  // app.get("/api/scores", (req, res) => {
  //   // findAll returns all entries for a table when used with no options
  //   db.Score.findAll({}).then(dbScore => {
  //     // We have access to the scores as an argument inside of the callback function
  //     res.json(dbScore);
  //   });
  // });
};
