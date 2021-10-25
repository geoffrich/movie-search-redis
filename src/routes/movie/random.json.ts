import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';
import { MOVIE_IDS_KEY } from '$lib/redis';

export const get: RequestHandler = async function () {
	const redis = new Redis();
	const randomId = await redis.srandmember(MOVIE_IDS_KEY);
	return {
		body: randomId
	};
};
