import { Agent } from '@intrnl/bluesky-client/agent';
import type { Records } from '@intrnl/bluesky-client/atp-schema';

import { DAILY_EVENTS, WEEKLY_EVENTS, getNextOccurence } from './events.ts';

interface Env {
	BLUESKY_SERVICE: string;
	BLUESKY_USERNAME: string;
	BLUESKY_PASSWORD: string;
}

type PostRecord = Records['app.bsky.feed.post'];

const DAILY_CRON = '0 12 * * *';
const WEEKLY_CRON = '0 3 * * 4';

const dateformatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

const handlers: ExportedHandler<Env> = {
	async scheduled(event, env, _ctx) {
		const cron = event.cron;

		const isDailyCron = cron === DAILY_CRON;
		const isWeeklyCron = cron === WEEKLY_CRON;

		if (!isDailyCron && !isWeeklyCron) {
			console.log(`> cron triggered but is not the right one that is hardcoded`);
			return;
		}

		console.log(`> cron triggered`);

		// Craft the message
		const now = getCurrentTime();
		const ms = now.getTime();

		const date = dateformatter.format(now);

		let message = '';

		if (isDailyCron) {
			message += `#PSO2NGS ${date} daily reset`;

			for (const event of DAILY_EVENTS) {
				const next = getNextOccurence(ms, event.start, event.occurence);
				message += '\n' + event.formatEvent(next.index);
			}
		} else if (isWeeklyCron) {
			message += `#PSO2NGS ${date} weekly reset\nAlliance tasks:`;

			for (const event of WEEKLY_EVENTS) {
				const next = getNextOccurence(ms, event.start, event.occurence);
				message += '\n' + event.formatEvent(next.index);
			}
		} else {
			throw new Error(`unexpected`);
		}

		console.log(message);

		// Login to Bluesky
		const agent = new Agent({ serviceUri: env.BLUESKY_SERVICE });
		await agent.login({ identifier: env.BLUESKY_USERNAME, password: env.BLUESKY_PASSWORD });

		const session = agent.session!;

		console.log(`> logged in as ${session.handle} (${session.did})`);

		// Send the message!
		const record: PostRecord = {
			text: message,
			createdAt: now.toISOString(),
		};

		await agent.rpc.call('com.atproto.repo.createRecord', {
			data: {
				repo: session.did,
				collection: 'app.bsky.feed.post',
				record: record,
			},
		});

		console.log(`> post sent`);
	},
};

export default handlers;

const getCurrentTime = () => {
	const date = new Date();
	date.setMilliseconds(0);

	return date;
};
