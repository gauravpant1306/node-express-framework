const fs = require("fs").promises;
const { withoutInput, oneInput, twoInput } = require("./dataTypes");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let count = process.argv.slice(2)[0]; // get file number

const readTemplateFile = async () => {
  const res = await fs.readFile(
    "../template/migration_template.js",
    "utf8",
    (result) => result
  );
  return res;
};

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

const getTableName = async (data) => {
  let tablename = (await prompt("Enter table name: "))
    .trim()
    .split(" ")
    .join("");
  while (!isValid(tablename))
    tablename = (await prompt("Enter table name: ")).trim().split(" ").join("");
  data = data.replace(/{tableName}/g, tablename);
  return data;
};

const inputColumnName = async () => {
  let columnName = (await prompt("Enter column name: "))
    .trim()
    .split(" ")
    .join("");
  while (!isValid(columnName))
    columnName = (await prompt("Enter valid column name: "))
      .trim()
      .split(" ")
      .join("");
  return columnName;
};

const inputColumnType = async () => {
  let columnType = await prompt("Enter column type: ");
  columnType = columnType.trim().split(" ").join("").toLowerCase(); // remove all whitespaces
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

const inputKeywords = async () => {
  let keywords = await prompt("Enter the keyword(s): ");
  let status = await prompt("Add more keywords? y/n: ");
  while (status.toLowerCase() == "y") {
    keywords += " " + (await prompt("Enter the keyword(s): "));
    status = await prompt("Add more keywords? y/n: ");
  }
  return keywords.trim().toUpperCase();
};

const addColumn = async (data) => {
  let column = "";
  const regex = /^[0-9]+$/;
  let numOfCol = await prompt("Enter total number of columns: ");

  while (!regex.test(numOfCol)) {
    console.log("Input must be a number");
    numOfCol = await prompt("Enter total number of columns: ");
  }

  while (numOfCol > 0) {
    if (column.length > 0) {
      column += ",\n\t\t";
    }

    let variables = {
      columnName: await inputColumnName(),
      columnType: await inputColumnType(),
      isPrimaryKey: await prompt("Is Primary Key? y/n: "),
      keywords:
        (await prompt("Add any keywords? y/n: ")).toLowerCase() == "y"
          ? await inputKeywords()
          : "",
    };

    variables.isPrimaryKey =
      variables.isPrimaryKey.toLowerCase() == "y" ? "PRIMARY KEY" : "";

    column += await replaceVariables(variables);
    numOfCol--;
  }
  readline.close();

  data = data.replace(/{column}/, column);
  return data;
};

const replaceVariables = async (col) => {
  let column = await fs.readFile(
    "../template/column_template",
    "utf8",
    (result) => result
  );
  column = column.replace(/{columnName}/, col.columnName);
  column = column.replace(/{columnType}/, col.columnType);
  column = column.replace(/{keywords}/, col.keywords);
  column = column.replace(/{isPrimaryKey}/, col.isPrimaryKey);
  return column;
};

const writeToFile = async (data) => {
  const today = new Date().toLocaleDateString().replace(/\//g, "");
  let filename = `../migrationFiles/migration_${today}_${count}.js`;
  await fs.writeFile(filename, data);
};

readTemplateFile()
  .then((data) => getTableName(data))
  .then((data) => addColumn(data))
  .then((data) => writeToFile(data))
  .then(() => {
    console.log("File successfully created!");
  })
  .catch((err) => {
    readline.close();
    console.log("Error occured! => " + err);
    return;
  });
