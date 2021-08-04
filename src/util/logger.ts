import { default as Pino } from "pino";

const logger = Pino({
	level: "debug",
	prettyPrint: {
		colorize: true,
		ignore: "pid,hostname",
		translateTime: "dd/mm/yy HH:MM:ss",
	},
});

export default logger;
