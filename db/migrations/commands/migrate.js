const { query } = require("../../core/pgquery");

// Import all the files from ../migrationFiles and store exported functions from each file in filesArr
let filesArr = [];
require("fs")
  .readdirSync(require("path").join(__dirname, "../migrationFiles"))
  .forEach((file) => {
    let currentFile = require(`../migrationFiles/${file}`);
    filesArr.push(currentFile);
  });

const createAllTables = async () => {
  // Execute all createTable functions
  for (let file of filesArr) await query(file.createTable());
};

const dropAllTables = async () => {
  // Execute all dropTable functions
  for (let file of filesArr) await query(file.dropTable());
};

let input = process.argv.slice(2)[0];
if (input == "undo")
  dropAllTables()
    .then(() => console.log("Dropped all tables."))
    .catch((err) => console.log("Error occured: " + err));
else
  createAllTables()
    .then(() => console.log("All tables migrated successfully."))
    .catch((err) => console.log("Error occured: " + err));
