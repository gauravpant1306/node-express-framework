const { create } = require("lodash");

const fs = require("fs").promises;

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// take 'count' from command-line: node create_migration.js 1
let count = process.argv.slice(2)[0];

const prompt = (query) => new Promise((res) => readline.question(query, res));

const addColumn = async (variables) => {
  variables.columnName = await prompt("Enter columnName: ");
  variables.columnType = await prompt("Enter columnType: ");

  let allowedAsNULL = await prompt("Can be NULL? y/n: ");
  allowedAsNULL = allowedAsNULL.toLowerCase() === "y" ? "NULL," : "NOT NULL,";
  variables.allowedAsNULL = allowedAsNULL;

  return variables;
};

const replaceVariables = async (data, col) => {
  data = data.replace(/{tableName}/, col.tableName);
  data = data.replace(/{columnName}/, col.columnName);
  data = data.replace(/{columnType}/, col.columnType);
  data = data.replace(/{allowedAsNULL}/, col.allowedAsNULL);
  return data;
};

const createFile = (data) => {
  let today = new Date().toLocaleDateString().replace(/\//g, "");
  let filename = `migration_${today}_${count}.js`;
  fs.writeFile(filename, data);
};

const editTemplate = async () => {
  let data = await fs.readFile(
    "../template/migration_template.js",
    "utf8",
    (result) => result
  );

  let variables = {
    tableName: await prompt("Enter tablename: "),
    columnName: "",
    columnType: "",
    allowedAsNULL: "",
  };

  variables = await addColumn(variables);
  data = await replaceVariables(data, variables);

  let status = await prompt("Add more columns? y/n ");
  if (status.toLowerCase() === "y") {
    let numOfCol = await prompt("Enter total number of columns: ");
    // let numOfCol = 1; // based on template, only one more column can be added
    while (numOfCol > 0) {
      variables = await addColumn(variables);
      data = await replaceVariables(data, variables);
      numOfCol--;
    }
  }

  readline.close();
  createFile(data);
};

editTemplate()
  .then(() => console.log("File successfully created!"))
  .catch((err) => {
    console.log(err);
    return;
  });
