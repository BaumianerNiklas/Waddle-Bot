import WaddleBot from "./WaddleBot";

export default abstract class BaseEvent implements IEvent {
	name: string;
	once: boolean;

	constructor(data: IEvent) {
		this.name = data.name;
		this.once = data.once;
	}

	abstract run(bot?: WaddleBot, ...args: unknown[]): Promise<unknown>;
}

interface IEvent {
	name: string;
	once: boolean;
}
