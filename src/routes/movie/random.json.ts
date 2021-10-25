import type { RequestHandler } from '@sveltejs/kit';
import { MOVIE_IDS_KEY, initRedis } from '$lib/redis';

export const get: RequestHandler = async function () {
	const redis = initRedis();
	const randomId = await redis.srandmember(MOVIE_IDS_KEY);
	await redis.quit();
	return {
		body: randomId
	};
};
