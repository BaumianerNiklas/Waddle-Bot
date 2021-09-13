import type { IEvent } from "#types";
import type { WaddleBot } from "./WaddleBot";

export abstract class BaseEvent implements IEvent {
	name: string;
	once: boolean;

	constructor(data: IEvent) {
		this.name = data.name;
		this.once = data.once;
	}

	abstract run(bot?: WaddleBot, ...args: unknown[]): Promise<unknown>;
}
