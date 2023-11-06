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

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API 1

app.get("/players/", async (request, response) => {
  const getBooksQuary = `
    SELECT * FROM cricket_team;
    `;
  const playersArray = await db.all(getBooksQuary);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

// API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postPlayerQuary = `
    INSERT INTO 
    cricket_team (player_name,jersey_number, role)
    Values 
    (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    );
    `;
  const dbResponse = await db.run(postPlayerQuary);
  response.send("Player Added to Team");
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetailsQuary = `
    SELECT * FROM cricket_team Where player_id = ${playerId};
    `;
  const playerDetails = await db.get(playerDetailsQuary);
  response.send(convertDbObjectToResponseObject(playerDetails));
});

// API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuary = `
    UPDATE 
    cricket_team
     SET
          player_name = '${playerName}',
          jersey_number = ${jerseyNumber},
          role = '${role}'
      WHERE 
        player_id = ${playerId};
    `;
  const dbObject = await db.run(updateQuary);
  response.send("Player Details Updated");
});

// API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuary = `
    DELETE FROM
    cricket_team
    WHERE 
    player_id = ${playerId};
    `;
  const dbResponse = await db.run(deleteQuary);
  response.send("Player Removed");
});
