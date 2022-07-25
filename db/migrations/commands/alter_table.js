const { query } = require("../../core/pgquery");
const { withoutInput, oneInput, twoInput } = require("./dataTypes"); // get data types

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) => new Promise((res) => readline.question(query, res));

const isValid = (str) => {
  const start = new RegExp("^[a-zA-Z_]"); // Names must begin with an alphabetic character or an underscore (_).
  const regEx = new RegExp("^([a-zA-Z0-9 _#@$]+)$"); // Name must only conatin alphanumeric characters and the special characters: 0 through 9, #, @, and $
  let result = regEx.test(str) && start.test(str);
  if (!result) {
    console.log(
      `Invalid input!
      -> Names must begin with an alphabetic character or an underscore (_)
      -> Names can contain only have alphanumeric characters and the following special characters: 0 through 9, _, #, @, and $`
    );
  }
  return result;
};

const getTableName = async (command) => {
  let tablename = await prompt("Enter table name: ");
  tablename = tablename.trim().split(" ").join("");
  while (!isValid(tablename))
    tablename = (await prompt("Enter table name: ")).trim().split(" ").join("");
  command = command.replace(/tablename/, tablename);
  return command;
};

const getAction = async (command) => {
  console.log(
    "Available actions:\n   1. ADD COLUMN\n   2. DROP COLUMN\n   3. ALTER COLUMN\n   4. ADD CONSTRAINT\n   5. RENAME COLUMN\n   6. RENAME TO (rename table)\n   7. DROP CONSTRAINT"
  );
  let actionNum = (await prompt("Select an action (number): ")).trim();
  while (isNaN(actionNum) || actionNum < 1 || 7 < actionNum)
    actionNum = await prompt("Invalid input. Try again: ");

  let action = "";
  if (actionNum == 1) {
    action = await addColumn();
  } else if (actionNum == 2) {
    action = await dropColumn();
  } else if (actionNum == 3) {
    action = await alterColumn();
  } else if (actionNum == 4) {
    action = await addConstraint();
  } else if (actionNum == 5) {
    action = await renameColumn();
  } else if (actionNum == 6) {
    action = await renameTablename();
  } else if (actionNum == 7) {
    action = await dropConstraint();
  }

  command = command.replace(/action/, action);
  return command;
};

const inputColumnType = async () => {
  let columnType = await prompt("Enter column type: ");
  columnType = columnType.trim().split(" ").join("").toLowerCase();
  if (columnType === "doubleprecision") {
    columnType = "DOUBLE PRECISION";
    return columnType;
  } else if (withoutInput.includes(columnType)) {
    return columnType.toUpperCase();
  } else if (oneInput.includes(columnType)) {
    const regex = /^([0-9])+$/;
    if (regex.test(columnType.substring(columnType.length - 3)))
      return columnType.toUpperCase(); // input already provided
    else {
      let input = await prompt(`Enter size of ${columnType}: `);
      columnType += `(${input})`;
      return columnType.toUpperCase();
    }
  } else if (twoInput.includes(columnType)) {
    const regex = /^([0-9],[0-9])+$/;
    if (regex.test(columnType.substring(columnType.length - 5)))
      return columnType.toUpperCase(); // input already provided
    else {
      let d = await prompt("Enter number of digits: ");
      let p = await prompt("Enter number of decimal points: ");
      columnType += `(${d},${p})`;
      return columnType.toUpperCase();
    }
  }
  return columnType.toUpperCase();
};

const addColumn = async () => {
  let columnName = await prompt("Enter column name: ");
  columnName = columnName.trim().split(" ").join("");
  while (!isValid(columnName)) {
    columnName = await prompt("Enter valid column name: ");
    columnName = columnName.trim().split(" ").join("");
  }
  let columnType = await inputColumnType();
  columnType = columnType.trim();
  return `ADD COLUMN ${columnName} ${columnType}`;
};

const dropColumn = async () => {
  let columnName = await prompt("Enter column name: ");
  columnName = columnName.trim().split(" ").join("");
  return `DROP COLUMN ${columnName}`;
};

const inputKeywords = async () => {
  let keywords = await prompt("Enter the keyword(s): ");
  let status = await prompt("Add more keywords? y/n: ");
  while (status.toLowerCase() == "y") {
    keywords += " " + (await prompt("Enter the keyword(s): "));
    status = await prompt("Add more keywords? y/n: ");
  }
  console.log(keywords);
  return keywords.trim().toUpperCase();
};

const alterColumn = async () => {
  let columnName = await prompt("Enter column to be altered: ");
  columnName = columnName.trim().split(" ").join("");
  let columnType = await inputColumnType();
  let keywords = await inputKeywords();
  return `ALTER COLUMN ${columnName} TYPE ${columnType} ${keywords}`;
};

const addConstraint = async () => {
  let constraintName = await prompt("Enter constaint name: ");
  constraintName = constraintName.trim().split(" ").join("");
  let constraintDefinition = await prompt("Enter constraint definition: ");
  constraintDefinition = constraintDefinition.trim();
  return `ADD CONSTRAINT ${constraintName} ${constraintDefinition}`;
};

const renameColumn = async () => {
  let oldColumnName = await prompt("Enter column to be renamed: ");
  oldColumnName = oldColumnName.trim().split(" ").join("");
  let newColumnName = await prompt("Enter new column name: ");
  newColumnName = newColumnName.trim().split(" ").join("");
  return `RENAME COLUMN ${oldColumnName} TO ${newColumnName}`;
};

const renameTablename = async () => {
  let newTableName = await prompt("Enter new Table name: ");
  newTableName = newTableName.trim().split(" ").join("");
  return `RENAME TO ${newTableName}`;
};

const dropConstraint = async () => {
  let constraintName = await prompt("Enter constaint name: ");
  constraintName = constraintName.trim().split(" ").join("");
  return `DROP CONSTRAINT ${constraintName}`;
};

const errorOccured = (err) => {
  readline.close();
  console.log("Something went wrong: " + err);
};

const runQuery = async (command) => {
  let status = await prompt("Execute: '" + command + "' ? y/n: ");
  if (status.trim().toLowerCase() === "y") {
    console.log("Executing...");
    await query(command);
    console.log("Command successfully executed!");
  } else console.log("Aborting...");
  readline.close();
};

getTableName("ALTER TABLE tablename action")
  .then((command) => getAction(command))
  .then((command) => runQuery(command))
  .catch((err) => errorOccured(err));
