import { default as Pino } from "pino";

export const logger = Pino({
	level: "debug",
	prettyPrint: {
		colorize: true,
		ignore: "pid,hostname",
		translateTime: "dd/mm/yy HH:MM:ss",
	},
});
