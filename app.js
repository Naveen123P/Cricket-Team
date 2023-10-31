const express = require("express");
const app = express();
module.exports = app;
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initilizeDBAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getBooksQuary = `
    SELECT * FROM cricket_team;
    `;
  const playersArray = await db.all(getBooksQuary);
  response.send(playersArray);
});

// API 2

app.post("/players/", async (request, response) => {
  const postPlayerQuary = `
    INSERT INTO cricket_team 
    `;
});
