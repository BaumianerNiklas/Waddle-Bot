import { ActionRow, Button } from "#util/builders.js";
import { disabledComponents } from "#util/functions.js";
import { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Message,
	User,
	ApplicationCommandOptionType,
	ButtonStyle,
	ComponentType,
} from "discord.js";
import { ChatInputCommand } from "iubus";

type Player = "X" | "O";
type BoardItem = Player | null; // null for empty
type Board = BoardItem[][];

export default new ChatInputCommand({
	name: "tic-tac-toe",
	description: "Play Tic Tac Toe against someone!",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "opponent",
			description: "The user to play against",
			required: true,
		},
	],
	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;
		const opponent = int.options.getUser("opponent", true);

		// TODO: support for playing against the bot
		if (opponent.bot) {
			return int.editReply("Sorry, robots are busy with doing roboter things and can't play Tic Tac Toe");
		}

		const prompt =
			opponent.id === int.user.id
				? "Do you really want to play against yourself? I'm not gonna stop you, don't you think that's a bit boring though?"
				: `<@!${opponent.id}>, ${int.user.username} challenged you to a game of **TicTacToe**! Click on a button in the next 30 seconds to accept or decline!`;

		int.editReply({
			content: prompt,
			components: [
				ActionRow(
					Button({ custom_id: "decline", label: "Decline", style: ButtonStyle.Danger }),
					Button({ custom_id: "accept", label: "Accept", style: ButtonStyle.Success })
				),
			],
		});

		let answer;
		try {
			const filter = (i: ButtonInteraction) => i.user.id === opponent.id;
			answer = await botMsg.awaitMessageComponent({ time: 30e3, filter, componentType: ComponentType.Button });
		} catch (e) {
			return int.editReply({
				content: `${opponent.username} did not accept or decline in time.`,
				components: [],
			});
		}
		if (answer.customId === "decline") {
			return answer.update({ content: `${opponent.username} declined the play request.`, components: [] });
		}

		// Game
		// Generate blank board with fancy use of spreading operator and map
		const board: Board = [...Array(3)].map(() => [...Array(3)].map(() => null));
		let turn = 1;
		let player: Player = "X";
		let curUser = int.user;

		answer.update({
			content: generateContent(turn, int.user, opponent),
			components: generateGameComponents(board),
		});

		const gameFilter = (i: ButtonInteraction) => i.user.id === int.user.id || i.user.id === opponent.id;
		const collector = botMsg.createMessageComponentCollector({
			filter: gameFilter,
			componentType: ComponentType.Button,
			time: 30e3,
		});

		collector.on("collect", (btn) => {
			curUser = turn % 2 === 0 ? opponent : int.user;
			player = turn % 2 === 0 ? "O" : "X";
			if (btn.user.id !== curUser.id) return;

			// Custom ID format - <Y>_<X> (+ _<PLAYER> if it is taken)
			const [y, x] = btn.customId.split("_").map((x) => parseInt(x));
			board[y][x] = player;

			if (checkWinner(board)) {
				collector.stop("GAME_OVER");
				return void btn.update({
					content: `**${curUser.username} won!** (in ${turn} turns)`,
					components: disabledComponents(generateGameComponents(board)),
				});
			}
			collector.resetTimer();

			// If the move in this turn was not a winning move and the game is on its 9th turn,
			// every square is taken and the game is a tie
			if (turn === 9) {
				collector.stop("GAME_OVER");
				return void btn.update({ content: "It's a tie!", components: generateGameComponents(board) });
			}

			turn++;
			btn.update({
				content: generateContent(turn, int.user, opponent),
				components: generateGameComponents(board),
			});
		});

		collector.on("end", async (_, reason) => {
			if (reason === "GAME_OVER") return;
			botMsg.edit({
				content: "No player has made a move in 30 seconds, so the game was cancelled. ",
				components: disabledComponents((await botMsg.fetch()).components.map((x) => x.toJSON())),
			});
		});
	},
});

function checkWinner(board: Board) {
	// Brute force approach, probably not the best way of doing it
	// Should not be that bad though as the board only consists of 9 squares and the checks are minimal

	// Horizontal
	for (let y = 0; y < board.length; y++) {
		if (board[y].join("") === "XXX" || board[y].join("") === "OOO") {
			return true;
		}
	}
	// Vertical
	for (let x = 0; x < board.length; x++) {
		if (board[0][x] && board[0][x] === board[1][x] && board[0][x] === board[2][x]) {
			return true;
		}
	}

	// Diagonal
	if (
		// up right -> down left
		(board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
		// down right -> up left
		(board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0])
	) {
		return true;
	}
	return false;
}

function generateGameComponents(board: Board) {
	// const rows: ActionRowBuilder[] = [];
	const rows: APIActionRowComponent<APIMessageActionRowComponent>[] = [];

	board.forEach((boardRow, y) => {
		const actionRow = ActionRow();

		boardRow.forEach((boardItem, x) => {
			if (boardItem) {
				actionRow.components.push(
					Button({
						custom_id: `${y}_${x}_${boardItem}`,
						label: boardItem,
						style: boardItem === "X" ? ButtonStyle.Primary : ButtonStyle.Success,
						disabled: true,
					})
				);
			} else {
				actionRow.components.push(
					Button({
						custom_id: `${y}_${x}`,
						label: " ",
						style: ButtonStyle.Secondary,
					})
				);
			}
		});
		rows.push(actionRow);
	});
	return rows;
}

function generateContent(turn: number, player1: User, player2: User) {
	const player = turn % 2 === 0 ? "O" : "X";
	const curUser = player === "X" ? player1.id : player2.id;
	return `**Turn**: ${turn} - **Player**: ${player} (<@!${curUser}>)`;
}
