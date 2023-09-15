export interface ScheduledEvent {
	start: number;
	occurence: number;
	formatEvent: (seq: number) => string;
}

const utc = Date.UTC;

export const getNextOccurence = (now: number, start: number, occurence: number) => {
	const diff = now - start;
	const index = Math.ceil(diff / occurence);

	const date = new Date(start + index * occurence);

	return { index, date };
};

const enum Occurence {
	DAILY = 86400000,
	WEEKLY = 604800000,
}

const getSequence = <T>(array: T[], seq: number) => {
	return array[seq % array.length];
};

// Daily events
const DAILY_REGION_SEQUENCE = ['Stia', 'Retem', 'Aelio', 'Kvaris'];
const DAILY_FORAGING_SEQUENCE = ['Fruit', 'Mineral', 'Vegetable', 'TAMES', 'Seafood'];

const DAILY_GPTREE_SEQUENCE = [
	[{ id: 4, points: 315 }],
	[{ id: 1, points: 625 }],
	[{ id: 8, points: 315 }],
	[{ id: 5, points: 315 }],
	[{ id: 2, points: 625 }],
	[{ id: 7, points: 315 }],
	[{ id: 6, points: 315 }],
	[{ id: 3, points: 625 }],
	[{ id: 6, points: 315 }],
	[{ id: 7, points: 315 }],
	[
		{ id: 0, points: 315 },
		{ id: 4, points: 625 },
	],
	[{ id: 5, points: 315 }],
	[
		{ id: 3, points: 315 },
		{ id: 8, points: 315 },
	],
	[{ id: 5, points: 625 }],
	[{ id: 4, points: 315 }],
	[{ id: 9, points: 315 }],
	[{ id: 6, points: 625 }],
	[{ id: 3, points: 315 }],
	[{ id: 0, points: 315 }],
	[{ id: 7, points: 625 }],
	[{ id: 2, points: 315 }],
	[{ id: 1, points: 315 }],
	[{ id: 8, points: 625 }],
	[{ id: 1, points: 315 }],
	[{ id: 2, points: 315 }],
	[{ id: 9, points: 625 }],
	[{ id: 0, points: 625 }],
	[{ id: 9, points: 315 }],
];

export const DAILY_EVENTS: ScheduledEvent[] = [
	// Daily tasks
	{
		start: utc(2023, 7, 13, 12),
		occurence: Occurence.DAILY,
		formatEvent: (seq) => {
			const region = getSequence(DAILY_REGION_SEQUENCE, seq);
			const foraging = getSequence(DAILY_FORAGING_SEQUENCE, seq);

			return `Daily tasks: ${region} region, ${foraging} foraging`;
		},
	},
	// GP trees
	{
		start: utc(2022, 8, 3, 12),
		occurence: Occurence.DAILY,
		formatEvent: (seq) => {
			const trees = getSequence(DAILY_GPTREE_SEQUENCE, seq);
			const fmts = trees.map((tree) => `GPID${tree.id} (${tree.points}pts)`);

			return `GP tree: ${fmts.join(', ')}`;
		},
	},
];

// Weekly events
const ALLIANCE_REGION_SEQUENCE = ['Stia', 'Aelio', 'Retem', 'Kvaris'];
const ALLIANCE_AUGMENT_SEQUENCE = ['Note A', 'Note B', 'Note C', 'Note D'];
const ALLIANCE_RARE_SEQUENCE = ['Gold', 'Silver'];
const ALLIANCE_RACE_SEQUENCE = ['Board', 'Dash'];
const ALLIANCE_RANDOM_SEQUENCE = ['Kudos', 'Region Mags', 'Battledia Yellow'];

export const WEEKLY_EVENTS: ScheduledEvent[] = [
	{
		start: utc(2023, 1, 22, 3),
		occurence: Occurence.WEEKLY,
		formatEvent: (seq) => {
			const region = getSequence(ALLIANCE_REGION_SEQUENCE, seq);
			const augment = getSequence(ALLIANCE_AUGMENT_SEQUENCE, seq);
			const rareEnemy = getSequence(ALLIANCE_RARE_SEQUENCE, seq);
			const fieldRace = getSequence(ALLIANCE_RACE_SEQUENCE, seq);
			const random = getSequence(ALLIANCE_RANDOM_SEQUENCE, seq);

			return (
				`Alliance tasks:\n` +
				`  - ${region} region\n` +
				`  - ${augment} augment\n` +
				`  - ${rareEnemy} rare enemy\n` +
				`  - ${fieldRace} field race\n` +
				`  - ${random} random task`
			);
		},
	},
];
