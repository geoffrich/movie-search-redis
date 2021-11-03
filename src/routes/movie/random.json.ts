import type { RequestHandler } from '@sveltejs/kit';
import redis, { MOVIE_IDS_KEY } from '$lib/redis';

export const get: RequestHandler = async function () {
	const randomId = await redis.srandmember(MOVIE_IDS_KEY);
	return {
		body: randomId
	};
};
