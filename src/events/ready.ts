import { ActivityType } from "discord.js";
import { container, Event } from "iubus";

export default new Event({
	name: "ready",
	once: true,
	async run() {
		const { client } = container;

		client.user?.setPresence({ activities: [{ name: "being cute", type: ActivityType.Competing }] });
		container.logger.info(`Logged in as ${client.user!.tag}.`);
	},
});
