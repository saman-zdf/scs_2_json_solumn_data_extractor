import inquirer from "inquirer";
import fs from "fs";

type Question = {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  default?: () => string | boolean;
  when?: (...args: any) => void;
};

const extractColumnDateToJson = (): void => {
  const filePathQ: Question[] = [
    {
      type: "input",
      name: "file_path",
      message: "Please enter your file path:",
      default() {
        return "example.csv";
      },
    },
  ];

  let path: string = "";
  inquirer
    .prompt(filePathQ)
    .then(async (answers: { [key: string]: string }) => {
      path = answers.file_path;
    })
    .then(() => {
      const file: string | Buffer = fs.readFileSync(path, "utf8");

      const lines: string[] = file.trim().split("\n");
      const columnNames: string[] = lines[0].split(",");

      const question: Question[] = [
        {
          type: "list",
          name: "column_name",
          message: "Please select a column to extract data:",
          choices: columnNames,
        },
      ];

      inquirer
        .prompt(question)
        .then(async (answers: { [key: string]: string }) => {
          console.time("Extract duration: ");
          const getColumnIndex: number = columnNames.indexOf(
            answers.column_name
          );

          const getColumnData: string[] = lines.map(
            (line: string) => line.split(",")[getColumnIndex]
          );
          getColumnData.splice(0, 1);

          const writeStream: fs.WriteStream = fs.createWriteStream(
            `${answers.column_name.replace(" ", "_")}s.json`
          );

          for (let i = 0; i < getColumnData.length; i++) {
            const overWaterMark: boolean = writeStream.write(
              `${getColumnData[i]},`
            );

            if (!overWaterMark) {
              await new Promise<void>((resolve) =>
                // If buffer is overload, drain the first chunk/ write it to the json file, than continue if still data to extract.
                writeStream.once("drain", resolve)
              );
            }
          }
          writeStream.end();
          console.dir(
            `You've extracted ${getColumnData.length} values from ${
              columnNames[getColumnIndex as keyof typeof columnNames]
            } column.`
          );
          console.timeEnd("Extract duration: ");
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

extractColumnDateToJson();
