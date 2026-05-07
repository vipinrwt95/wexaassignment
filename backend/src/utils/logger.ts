import fs from "fs";
import path from "path";

const logFilePath = path.join(
  process.cwd(),
  "logs",
  "app.log"
);

export const writeLog = (
  message: string,
  data?: unknown
) => {
  const timestamp = new Date().toISOString();

  const logMessage = `
[${timestamp}]
${message}
${data ? JSON.stringify(data, null, 2) : ""}
----------------------------------------
`;

  fs.appendFileSync(logFilePath, logMessage);
};