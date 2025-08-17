import chalk from "chalk";

export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(`${chalk.bgBlueBright("[INFO]")} ${chalk.blueBright(msg)}`, `${chalk.gray(meta || "")}`);
  },
  warn: (msg: string, meta?: any) => {
    console.warn(`${chalk.bgYellowBright("[WARN]")} ${chalk.yellowBright(msg)}`, `${chalk.gray(meta || "")}`);
  },
  error: (msg: string | unknown, meta?: any) => {
    console.error(`${chalk.bgRedBright("[ERROR]")} ${chalk.redBright(msg)}`, `${chalk.gray(meta || "")}`);
  },
};