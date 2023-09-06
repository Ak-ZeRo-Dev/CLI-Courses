import fs from "node:fs";
import inquirer from "inquirer";
import { Command } from "commander";
const program = new Command();

const filePath = "./courses.json";

const addQuestions = [
  {
    type: "input",
    message: "what is the name of course?",
    name: "title",
  },
  {
    type: "number",
    message: "what is the price of course?",
    name: "price",
  },
];
const deleteQuestions = [
  {
    type: "input",
    message: "what is the name of course?",
    name: "title",
  },
];
const editQuestions = [
  {
    type: "list",
    name: "edit-type",
    message: "edit name or price>",
    choices: [
      { value: "Name" },
      { value: "Price" },
      { value: "Name And Price" },
    ],
  },
  {
    type: "input",
    name: "course-name",
    message: "what is your course name?",
  },
  {
    type: "input",
    name: "change-name",
    message: "what is the new course name?",
    when: (answers) =>
      answers["edit-type"].includes("Name") ||
      answers["edit-type"] === "Name And Price",
  },
  {
    type: "input",
    name: "change-price",
    message: "what is the new price?",
    when: (answers) =>
      answers["edit-type"].includes("Price") ||
      answers["edit-type"] === "Name And Price",
  },
];

program
  .name("courses")
  .description("CLI to make table of courses and control it")
  .version("1.0.0");

program
  .command("add")
  .alias("a")
  .description("add Course")
  .action(() => {
    inquirer
      .prompt(addQuestions)
      .then((answers) => {
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
              console.error(`Error -> ${err}`);
              process.exit();
            } else {
              const fileContent = JSON.parse(content);
              fileContent.push(answers);
              fs.writeFile(
                filePath,
                JSON.stringify(fileContent),
                "utf-8",
                (err) => {
                  if (err) throw new Error(`ERROR -> ${err}`);
                  else console.log("Done");
                }
              );
            }
          });
        } else {
          fs.writeFile(filePath, JSON.stringify([answers]), "utf-8", (err) => {
            if (err) throw new Error(`ERROR -> ${err}`);
            else console.log("Done");
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command("delete")
  .alias("d")
  .description("delete course by name")
  .action(() => {
    inquirer
      .prompt(deleteQuestions)
      .then((answers) => {
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
              console.error(`ERROR -> ${err}`);
            } else {
              const fileContent = JSON.parse(content);
              const updatedContent = fileContent.filter(
                (ele) => ele.title !== answers.title
              );
              fs.writeFileSync(
                filePath,
                JSON.stringify(updatedContent),
                "utf-8",
                (err) => {
                  if (err) throw new Error(`ERROR -> ${err}`);
                  else console.log("Done");
                }
              );
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command("edit")
  .alias("e")
  .description("edit course")
  .action(() => {
    inquirer
      .prompt(editQuestions)
      .then((answers) => {
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
              console.error(`ERROR -> ${err}`);
            } else {
              const fileContent = JSON.parse(content);
              const updatedContent = fileContent.map((ele) => {
                if (ele.title === answers["course-name"]) {
                  let updatedEle = { ...ele };
                  if (answers["edit-type"].includes("Name")) {
                    updatedEle.title = answers["change-name"];
                  }
                  if (answers["edit-type"].includes("Price")) {
                    updatedEle.price = parseFloat(answers["change-price"]);
                  }
                  if (answers["edit-type"].includes("Name And Price")) {
                    updatedEle.title = answers["change-name"];
                    updatedEle.price = parseFloat(answers["change-price"]);
                  }
                  return updatedEle;
                } else {
                  return ele;
                }
              });
              fs.writeFileSync(
                filePath,
                JSON.stringify(updatedContent),
                "utf-8"
              );
              console.log("DONE");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command("list")
  .alias("l")
  .description("list of all Courses")
  .action(() => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) throw new Error(`ERROR -> ${err}`);
      else console.table(JSON.parse(data));
    });
  });

program.parse(process.argv);
