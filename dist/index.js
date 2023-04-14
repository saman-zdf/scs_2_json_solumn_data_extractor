var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import fs from "fs";
const extractColumnDateToJson = () => {
    const filePathQ = [
        {
            type: "input",
            name: "file_path",
            message: "Please enter your file path:",
            default() {
                return "example.csv";
            },
        },
    ];
    let path = "";
    inquirer
        .prompt(filePathQ)
        .then((answers) => __awaiter(void 0, void 0, void 0, function* () {
        path = answers.file_path;
    }))
        .then(() => {
        const file = fs.readFileSync(path, "utf8");
        const lines = file.trim().split("\n");
        const columnNames = lines[0].split(",");
        const question = [
            {
                type: "list",
                name: "column_name",
                message: "Please select a column to extract data:",
                choices: columnNames,
            },
        ];
        inquirer
            .prompt(question)
            .then((answers) => __awaiter(void 0, void 0, void 0, function* () {
            console.time("Extract duration: ");
            const getColumnIndex = columnNames.indexOf(answers.column_name);
            const getColumnData = lines.map((line) => line.split(",")[getColumnIndex]);
            getColumnData.splice(0, 1);
            const writeStream = fs.createWriteStream(`${answers.column_name.replace(" ", "_")}s.json`);
            for (let i = 0; i < getColumnData.length; i++) {
                const overWaterMark = writeStream.write(`${getColumnData[i]},`);
                if (!overWaterMark) {
                    yield new Promise((resolve) => 
                    // If buffer is overload, drain the first chunk/ write it to the json file, and than continue.
                    writeStream.once("drain", resolve));
                }
            }
            writeStream.end();
            console.dir(`You've extracted ${getColumnData.length} values from ${columnNames[getColumnIndex]} column.`, { statusbar: true });
            console.timeEnd("Extract duration: ");
        }))
            .catch((err) => console.error(err));
    })
        .catch((err) => console.error(err));
};
extractColumnDateToJson();
