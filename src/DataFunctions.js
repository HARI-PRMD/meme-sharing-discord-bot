const sqlite3 = require("sqlite3").verbose();

// global database object
let database = new sqlite3.Database(
  "./data/discord.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

// initializes tables if they do not already exist
function InitTables() {
  // database.run(`CREATE TABLE IF NOT EXISTS channels (ID TEXT PRIMARY KEY)`);
  // database.run(`CREATE TABLE IF NOT EXISTS dms (ID TEXT PRIMARY KEY)`);
  database.serialize(() => {
    database
      .prepare(`CREATE TABLE IF NOT EXISTS channels (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
    database
      .prepare(`CREATE TABLE IF NOT EXISTS dms (ID TEXT PRIMARY KEY)`)
      .run()
      .finalize();
  });
}

function AppendId(table, id) {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const insertSql = `INSERT INTO ${table} (ID) VALUES (?)`;

  database.get(selectSql, [id.toString()], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    if (row.count == 0) {
      // inserts the id into the table
      database.run(insertSql, [id], (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log(`ID ${id} inserted into ${table}`);
      });
    } else {
      console.log(`ID ${id} already exists in ${table}`);
    }
  });
  return true;
}

function RemoveId(table, id) {
  const selectSql = `SELECT COUNT(*) AS count FROM ${table} WHERE ID = ?`;
  const removeSql = `DELETE FROM ${table} WHERE ID = ?`;
  database.get(selectSql, [id], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    // id value exists in the table
    if (row.count != 0) {
      database.run(removeSql, [id], (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log(`ID ${id} removed from ${table}`);
      });
    } else {
      console.log(`ID ${id} does not exist in ${table}`);
    }
  });
}

// returns array of all ids in table
async function GetAllIds(table) {
  return new Promise((resolve, reject) => {
    let IDS = [];
    database.all(`SELECT ID FROM ${table}`, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      IDS = rows.map((row) => row.ID);
      resolve(IDS);
    });
  });
}

// close the database connection
function CloseDb() {
  database.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
}

module.exports = {
  database,
  InitTables,
  AppendId,
  RemoveId,
  GetAllIds,
  CloseDb,
};
