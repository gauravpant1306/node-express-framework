const fs = require("fs").promises;

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let query = "Enter your name: ";

const prompt = (query) => new Promise((res) => readline.question(query, res));

const editTemplate = async (count) => {
  // Take input
  let name = await prompt(query);
  readline.close();
  // Read template file
  let data = await fs.readFile(
    "../template/template.txt",
    "utf8",
    (result) => result
  );
  // Replace the variable
  data = data.replace(/name/g, name);
  //   console.log(data);
  // Write to a file
  let filename = `greeting_${++count}.js`;
  await fs.writeFile(filename, data);
};

editTemplate(0)
  .then(() => console.log("Process completed!"))
  .catch((err) => {
    console.log(err);
    return;
  });
