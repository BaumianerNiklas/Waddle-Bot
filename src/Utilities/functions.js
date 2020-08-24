const axios = require("axios").default;
const Discord = require("discord.js");
const consts = require("./constants.js");
const { bot } = require("../index.js");

module.exports = {
	// GENERAL FUNCTIONS

	cleanColor(color) {
		if (!color.includes("#")) color = "#" + color;
		if (color.length > 7) color = color.substring(0, 7);
		return color;
	},

	formatFlags(flags) {
		// 	let result = [];
		// 	let regex = new RegExp(/(\w{1})(\S+_)(\w{1})/);

		// 	flags.forEach(flag => {
		// 		flag = flag.toLowerCase();
		// 		let match1 = flag.match(regex)[1];
		// 		let match2 = flag.match(regex)[3];

		// 		console.log(match1);
		// 		console.log(match2);

		// 		let index1 = flag.indexOf(match1);
		// 		let index2 = flag.indexOf(match2);

		// 		console.log(index1);
		// 		console.log(index2);
		// 		flag[flag.indexOf(match1)] = match1.toUpperCase();
		// 		flag[flag.indexOf(match2)] = match2.toUpperCase();
		// 		result.push(flag);
		// 	});
		let result = [];
		let regex = new RegExp(/\w{1}/);
		flags.forEach(flag => {
			flag.toLowerCase();
			let splitFlags = flag.split("_").forEach(part => {
				console.log(part.replace(regex, part.match(regex).toUpperCase()));
			});
			result.push(splitFlags.join(" "));
		});
		return result;
	},

	// API FUNCTIONS

	randGiphy(tag) {
		let gif;
		axios
			.get(
				`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=${tag}`,
			)
			.then(response => {
				gif = response.data.data.image_url;
			})
			.catch(err => {
				console.error(err);
			});

		if (gif) return gif;
	},

	// DISCORD FUNCTIONS

	// RESPONSES

	success(message) {
		let embed = new Discord.MessageEmbed()
			.setDescription(consts.tick + "Successfully " + message)
			.setColor(consts.green);
		return embed;
	},

	error(message) {
		let embed = new Discord.MessageEmbed()
			.setDescription(consts.cross + " " + message)
			.setColor(consts.red);
		return embed;
	},

	usageErr(errorMsg, command) {
		let embed = new Discord.MessageEmbed()
			.setColor(consts.red)
			.setDescription(
				`${consts.cross} ${errorMsg}\n**Usage:** \`${process.env.PREFIX}${
					bot.commands.get(command).help.usage
				}\``,
			);
		return embed;
	},

	// AUTOMATION & EASYMATION FUNCTIONS

	getTarget(message, findString, ignoreAuthor = false) {
		let target;
		if (findString) findString = findString.toLowerCase();

		if (message.mentions.members) target = message.mentions.members.last();

		if (!target && findString) {
			target = message.guild.members.cache.find(m => {
				return (
					m.id.includes(findString) ||
					m.user.tag.toLowerCase().includes(findString) ||
					m.displayName.toLowerCase().includes(findString)
				);
			});
		}

		if (!target && !ignoreAuthor) target = message.member;
		return target;
	},

	getRole(message, findString) {
		findString = findString.toLowerCase();
		if (!findString) return null;

		let role =
			message.mentions.roles.first() ||
			message.guild.roles.cache.find(
				r => r.name.toLowerCase().includes(findString) || r.id.includes(findString),
			);
		return role;
	},

	getChannel(message, findString, ignoreCurrent = false) {
		findString = findString.toLowerCase().replace(/ /g, "-");

		let channel = message.mentions.channels.first();

		if (!channel && findString) {
			channel = message.guild.channels.cache.find(
				c => c.name.toLowerCase().includes(findString) || c.id.includes(findString),
			);
		}

		if (!channel && !ignoreCurrent) {
			channel = message.channel;
		}
		return channel;
	},

	getImage(message, target, link) {
		//const targetCheck = target !== message.member ? true : false;
		const linkCheck = link ? true : false;

		let image;
		if (target && target.id !== message.author.id) {
			image = target.user.displayAvatarURL({ format: "jpg" });
		} else {
			if (linkCheck) {
				image = link;
			} else if (target) {
				image = target.user.displayAvatarURL({ format: "jpg" });
			} else {
				image = message.author.displayAvatarURL({ format: "jpg" });
			}
		}
		return image;
	},

	getAvatar(user) {
		return user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
	},

	emoteToUrl(emoteIdentifier) {
		let regex = /<:?(a:)?(\w+):(\d+)>/;
		const emoteId = emoteIdentifier.match(regex)[3];
		return bot.emojis.cache.get(emoteId).url;
	},

	getEmote(findString, guild) {
		if (!findString) return;
		findString = findString.toLowerCase();
		return guild.emojis.cache.find(
			e =>
				e.name.toLowerCase().includes(findString) ||
				e.id.includes(findString) ||
				e.toString().toLowerCase().includes(findString),
		);
	},
};

// PROTOTYPE METHODS

String.prototype.chunk = function (n) {
	let result = [];

	for (let i = 0; i < this.length; i += n) {
		result.push(this.substr(i, n));
	}

	return result;
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};
